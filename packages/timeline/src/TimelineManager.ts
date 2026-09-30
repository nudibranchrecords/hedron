import { Clock } from '@hedron-gl/clock'
import { ParamValue } from '@hedron-gl/engine'
import type {
  TimelineManagerTrack,
  Keyframe,
  TimelineManagerAudioTrack,
  TimelineManagerKeyframeTrack,
  KeyframeParam,
} from '@/types'

export type TrackValues = Record<string, ParamValue>

export type OnUpdateCallback = (values: TrackValues) => void

export class TimelineManager {
  private tracks: TimelineManagerTrack[]
  private durationMs: number
  private positionMs = 0
  // User intent: whether the timeline should be playing. May be true while the loop is suspended
  // because an audio track is buffering.
  private playing = false
  private loopRunning = false
  // Ids of audio tracks currently buffering (or not yet started); the loop stays suspended while non-empty.
  private bufferingTracks: Set<string> = new Set()
  private rafId: number | null = null
  private lastFrameTime: number | null = null
  private onUpdateCallback: OnUpdateCallback | null = null
  private cachedValues: TrackValues = {}
  private sortedKeyframesCache: Map<string, Keyframe[]> = new Map()
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private audioListenerControllers: Map<string, AbortController> = new Map()
  private lastKeyframeIndex: Map<string, number> = new Map()
  // Number of shot keyframes at or before the position as of the last check, per track.
  private shotKeyframeCount: Map<string, number> = new Map()
  private clock: Clock | null = null
  // Flattened (vector tracks expanded to their childTracks) view of timelineData.tracks, kept in
  // sync by buildCache() - avoids re-walking the track tree on every computeValues/emitUpdate call.
  private flatTracks: TimelineManagerTrack[] = []

  constructor({
    tracks,
    durationMs,
    clock,
  }: {
    tracks: TimelineManagerTrack[]
    durationMs: number
    clock?: Clock
  }) {
    this.tracks = tracks
    this.durationMs = durationMs
    this.clock = clock ?? null
    this.buildCache()
  }

  private flattenTracks(tracks: TimelineManagerTrack[]): TimelineManagerTrack[] {
    const allTracks: TimelineManagerTrack[] = []

    for (const track of tracks) {
      allTracks.push(track)
      if (track.trackType === 'vector' || track.trackType === 'sketch') {
        allTracks.push(...this.flattenTracks(track.childTracks))
      }
    }

    return allTracks
  }

  private buildCache() {
    this.sortedKeyframesCache.clear()
    this.resetKeyframeIndexes()
    this.flatTracks = this.flattenTracks(this.tracks)
    for (const track of this.flatTracks) {
      switch (track.trackType) {
        case 'audio':
          if (!track.audioUrl) {
            this.audioCache.delete(track.id)
            continue
          }
          if (this.audioCache.get(track.id)?.src !== track.audioUrl) {
            const audio = new Audio(track.audioUrl)
            audio.preload = 'auto'
            this.audioCache.set(track.id, audio)
            this.attachAudioListeners(track.id, audio)
          }
          break
        case 'keyframe':
          this.sortedKeyframesCache.set(
            track.id,
            [...track.keyframes].sort((a, b) => a.time - b.time),
          )
          break
      }
    }
  }

  private attachAudioListeners(trackId: string, audio: HTMLAudioElement) {
    this.audioListenerControllers.get(trackId)?.abort()
    const controller = new AbortController()
    const { signal } = controller
    this.audioListenerControllers.set(trackId, controller)

    // `waiting` fires when the element stops because it ran out of buffered data (or is seeking),
    // `playing` when it actually resumes. Mirror those onto the timeline loop.
    const markBuffering = () => {
      if (!this.playing) return
      this.bufferingTracks.add(trackId)
      this.syncLoopState()
    }
    const markReady = () => {
      if (!this.bufferingTracks.delete(trackId)) return
      this.syncLoopState()
    }

    audio.addEventListener('waiting', markBuffering, { signal })
    audio.addEventListener('stalled', markBuffering, { signal })
    audio.addEventListener('playing', markReady, { signal })
    audio.addEventListener('error', markReady, { signal })
  }

  private resetKeyframeIndexes() {
    this.lastKeyframeIndex.clear()
  }

  private getHeldValue(track: TimelineManagerKeyframeTrack): ParamValue | undefined {
    const sorted = (this.sortedKeyframesCache.get(track.id) ?? []) as KeyframeParam[]
    const startIndex = this.lastKeyframeIndex.get(track.id) ?? 0
    let value = startIndex > 0 ? sorted[startIndex - 1].value : undefined
    let lastIndex = startIndex
    for (let i = startIndex; i < sorted.length; i++) {
      if (sorted[i].time > this.positionMs) break
      value = sorted[i].value
      lastIndex = i + 1
    }
    this.lastKeyframeIndex.set(track.id, lastIndex)

    // interpolation for number values
    const current = sorted[lastIndex - 1]
    const next = sorted[lastIndex]
    if (current?.valueType === 'number' && next?.valueType === 'number') {
      const t = (this.positionMs - current.time) / (next.time - current.time)
      return current.value + (next.value - current.value) * t
    }

    return value
  }

  // Shot keyframes are momentary triggers, not held state: fire once whenever the number of
  // keyframes crossed (time <= position) increases since the last check.
  private getShouldShotFire(track: TimelineManagerTrack): true | undefined {
    const sorted = this.sortedKeyframesCache.get(track.id) ?? []
    const count = sorted.filter((kf) => kf.time < this.positionMs).length
    const lastCount = this.shotKeyframeCount.get(track.id) ?? 0
    this.shotKeyframeCount.set(track.id, count)
    return count > lastCount ? true : undefined
  }

  private isShotTrack(track: TimelineManagerTrack): boolean {
    return track.trackType === 'keyframe' && track.keyframes[0]?.nodeType === 'shot'
  }

  // Returns the value for a track at the current position, or undefined if no value is held.
  // Also returns true for shot tracks if a shot should fire at the current position, or undefined if not.
  private getTrackValue(track: TimelineManagerKeyframeTrack): ParamValue | true | undefined {
    return this.isShotTrack(track) ? this.getShouldShotFire(track) : this.getHeldValue(track)
  }

  private computeValues(): TrackValues {
    const values: TrackValues = {}
    for (const track of this.flatTracks) {
      if (track.trackType !== 'keyframe') continue
      const value = this.getTrackValue(track)
      if (value !== undefined) {
        values[track.id] = value
      }
    }
    return values
  }

  private getChangedValues(newValues: TrackValues): TrackValues {
    const changed: TrackValues = {}
    for (const track of this.getAllTracks()) {
      const value = newValues[track.id]
      if (value === undefined) continue

      // Shot fires are already edge-detected in getShotFired, so a `true` is forwarded as-is
      // rather than compared against the last value (there's no "held state" to diff against).
      if (this.isShotTrack(track)) {
        changed[track.id] = value
      } else if (this.cachedValues[track.id] !== value) {
        changed[track.id] = value
      }
    }

    return changed
  }

  private emitUpdate() {
    const values = this.computeValues()
    const changed = this.getChangedValues(values)
    this.cachedValues = values
    this.onUpdateCallback?.(changed)
  }

  private getAudioTracksWithAudio(): {
    track: TimelineManagerAudioTrack
    audio: HTMLAudioElement
  }[] {
    return this.flatTracks
      .filter(
        (track): track is TimelineManagerAudioTrack =>
          track.trackType === 'audio' && this.audioCache.has(track.id),
      )
      .map((track) => ({
        track,
        audio: this.audioCache.get(track.id)!,
      }))
  }

  // The first audio track drives the playhead: its currentTime is the source of truth so the
  // timeline can never drift ahead of audio that stalls or buffers.
  private getMainAudio(): HTMLAudioElement | null {
    return this.getAudioTracksWithAudio()[0]?.audio ?? null
  }

  private setPosition(nextMs: number) {
    const clamped = Math.max(0, Math.min(nextMs, this.durationMs))
    if (clamped < this.positionMs) {
      this.resetKeyframeIndexes()
    }
    this.positionMs = clamped

    if (this.clock) {
      this.clock.beatDeltaMs = this.positionMs
    }
  }

  private tick = (now: number) => {
    if (!this.loopRunning) return

    const masterAudio = this.getMainAudio()

    if (masterAudio && !masterAudio.paused) {
      this.setPosition(masterAudio.currentTime * 1000)
    } else if (this.lastFrameTime !== null) {
      this.setPosition(this.positionMs + (now - this.lastFrameTime))
    }
    this.lastFrameTime = now

    this.emitUpdate()

    if (this.positionMs >= this.durationMs) {
      this.goTo(0)
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  getAllTracks(): TimelineManagerTrack[] {
    return [...this.flatTracks]
  }

  // Starts/stops the raf loop (and audio) to match play intent, staying suspended while buffering.
  private syncLoopState() {
    const shouldRun = this.playing && this.bufferingTracks.size === 0
    if (shouldRun === this.loopRunning) return

    if (shouldRun) {
      this.startLoop()
    } else {
      this.stopLoop()
    }
  }

  private startLoop() {
    this.loopRunning = true
    this.lastFrameTime = null

    // Snap back to where the audio actually is before resuming.
    const masterAudio = this.getMainAudio()
    if (masterAudio && !masterAudio.paused) {
      this.setPosition(masterAudio.currentTime * 1000)
    }

    if (this.clock) {
      this.clock.beatDeltaMs = this.positionMs
      this.clock.continue()
    }

    // Re-align and restart any audio we paused while waiting on a buffering track.
    for (const { audio } of this.getAudioTracksWithAudio()) {
      if (!audio.paused) continue
      audio.currentTime = this.positionMs / 1000
      void audio.play().catch(() => {})
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  private stopLoop() {
    this.loopRunning = false
    this.lastFrameTime = null

    const masterAudio = this.getMainAudio()
    if (masterAudio) {
      this.setPosition(masterAudio.currentTime * 1000)
    }

    if (this.clock) {
      this.clock.stop()
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Buffering tracks are left alone so they keep loading and can emit `playing` when ready.
    for (const { track, audio } of this.getAudioTracksWithAudio()) {
      if (this.bufferingTracks.has(track.id)) continue
      audio.pause()
    }
  }

  play() {
    if (this.playing) return
    this.playing = true

    for (const { track, audio } of this.getAudioTracksWithAudio()) {
      // Treat every audio track as buffering until it reports `playing`, so the timeline never
      // runs ahead of audio that hasn't loaded yet.
      this.bufferingTracks.add(track.id)
      audio.currentTime = this.positionMs / 1000
      void audio.play().catch((error) => {
        console.error(`Timeline audio track "${track.id}" failed to play`, error)
        this.bufferingTracks.delete(track.id)
        this.syncLoopState()
      })
    }

    this.syncLoopState()
  }

  pause() {
    this.playing = false
    this.bufferingTracks.clear()
    this.stopLoop()
  }

  goTo(timeMs: number) {
    this.positionMs = Math.max(0, Math.min(timeMs, this.durationMs))
    this.lastFrameTime = null
    this.resetKeyframeIndexes()

    if (this.clock) {
      this.clock.beatDeltaMs = this.positionMs
    }

    // Seek audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.currentTime = this.positionMs / 1000
    }

    this.emitUpdate()
  }

  setTracks(tracks: TimelineManagerTrack[]) {
    this.tracks = tracks
    this.buildCache()
    this.emitUpdate()
  }

  setDurationMs(durationMs: number) {
    this.durationMs = Math.max(0, durationMs)

    // Ensure position stays within the new duration
    this.goTo(Math.min(this.positionMs, this.durationMs))
  }

  onUpdate(callback: OnUpdateCallback) {
    this.onUpdateCallback = callback
  }

  getPositionMs() {
    return this.positionMs
  }

  isPlaying() {
    return this.playing
  }

  dispose() {
    this.pause()
    for (const controller of this.audioListenerControllers.values()) {
      controller.abort()
    }
    this.audioListenerControllers.clear()
    this.onUpdateCallback = null
  }
}
