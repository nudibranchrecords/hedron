import { Clock } from '@hedron-gl/clock'
import { ParamValue } from '@hedron-gl/engine'
import type {
  TimelineManagerData,
  TimelineManagerTrack,
  Keyframe,
  TimelineManagerAudioTrack,
  TimelineManagerKeyframeTrack,
  KeyframeParam,
} from '@/types'

export type TrackValues = Record<string, ParamValue>

export type OnUpdateCallback = (values: TrackValues) => void

export class TimelineManager {
  private timelineData: TimelineManagerData
  private position = 0
  private playing = false
  private rafId: number | null = null
  private lastFrameTime: number | null = null
  private onUpdateCallback: OnUpdateCallback | null = null
  private cachedValues: TrackValues = {}
  private sortedKeyframesCache: Map<string, Keyframe[]> = new Map()
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private lastKeyframeIndex: Map<string, number> = new Map()
  // Number of shot keyframes at or before the position as of the last check, per track.
  private shotKeyframeCount: Map<string, number> = new Map()
  private clock: Clock | null = null
  // Flattened (vector tracks expanded to their childTracks) view of timelineData.tracks, kept in
  // sync by buildCache() - avoids re-walking the track tree on every computeValues/emitUpdate call.
  private flatTracks: TimelineManagerTrack[] = []

  constructor(timeline: TimelineManagerData, clock?: Clock) {
    this.timelineData = timeline
    this.clock = clock ?? null
    this.buildCache()
  }

  private flattenTracks(tracks: TimelineManagerTrack[]): TimelineManagerTrack[] {
    const allTracks: TimelineManagerTrack[] = []

    for (const track of tracks) {
      allTracks.push(track)
      if (track.trackType === 'vector') {
        allTracks.push(...this.flattenTracks(track.childTracks))
      }
    }

    return allTracks
  }

  private buildCache() {
    this.sortedKeyframesCache.clear()
    this.resetKeyframeIndexes()
    this.flatTracks = this.flattenTracks(this.timelineData.tracks)
    for (const track of this.flatTracks) {
      switch (track.trackType) {
        case 'audio':
          if (this.audioCache.get(track.id)?.src !== track.audioUrl) {
            const audio = new Audio(track.audioUrl)
            this.audioCache.set(track.id, audio)
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

  private resetKeyframeIndexes() {
    this.lastKeyframeIndex.clear()
  }

  private getHeldValue(track: TimelineManagerKeyframeTrack): ParamValue | undefined {
    const sorted = (this.sortedKeyframesCache.get(track.id) ?? []) as KeyframeParam[]
    const startIndex = this.lastKeyframeIndex.get(track.id) ?? 0
    let value = startIndex > 0 ? sorted[startIndex - 1].value : undefined
    let lastIndex = startIndex
    for (let i = startIndex; i < sorted.length; i++) {
      if (sorted[i].time > this.position) break
      value = sorted[i].value
      lastIndex = i + 1
    }
    this.lastKeyframeIndex.set(track.id, lastIndex)

    // interpolation for number values
    const current = sorted[lastIndex - 1]
    const next = sorted[lastIndex]
    if (current?.valueType === 'number' && next?.valueType === 'number') {
      const t = (this.position - current.time) / (next.time - current.time)
      return current.value + (next.value - current.value) * t
    }

    return value
  }

  // Shot keyframes are momentary triggers, not held state: fire once whenever the number of
  // keyframes crossed (time <= position) increases since the last check.
  private getShouldShotFire(track: TimelineManagerTrack): true | undefined {
    const sorted = this.sortedKeyframesCache.get(track.id) ?? []
    const count = sorted.filter((kf) => kf.time < this.position).length
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

  private tick = (now: number) => {
    if (!this.playing) return

    if (this.lastFrameTime !== null) {
      const delta = now - this.lastFrameTime
      this.position = Math.min(this.position + delta, this.timelineData.durationMs)

      if (this.clock) {
        this.clock.beatDeltaMs = this.position
      }
    }
    this.lastFrameTime = now

    this.emitUpdate()

    if (this.position >= this.timelineData.durationMs) {
      this.goTo(0)
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  getAllTracks(): TimelineManagerTrack[] {
    return [...this.flatTracks]
  }

  play() {
    if (this.playing) return

    if (this.clock) {
      this.clock.beatDeltaMs = this.position
      this.clock.continue()
    }

    this.playing = true
    this.lastFrameTime = null
    this.rafId = requestAnimationFrame(this.tick)

    // Play audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.currentTime = this.position / 1000
      audio.play()
    }
  }

  pause() {
    this.playing = false
    this.lastFrameTime = null

    if (this.clock) {
      this.clock.stop()
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Pause audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.pause()
    }
  }

  goTo(timeMs: number) {
    this.position = Math.max(0, Math.min(timeMs, this.timelineData.durationMs))
    this.lastFrameTime = null
    this.resetKeyframeIndexes()
    this.emitUpdate()

    if (this.clock) {
      this.clock.beatDeltaMs = this.position
    }

    // Seek audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.currentTime = this.position / 1000
    }
  }

  setTracks(tracks: TimelineManagerTrack[]) {
    this.timelineData.tracks = tracks
    this.buildCache()
    this.emitUpdate()
  }

  onUpdate(callback: OnUpdateCallback) {
    this.onUpdateCallback = callback
  }

  getPosition() {
    return this.position
  }

  isPlaying() {
    return this.playing
  }

  dispose() {
    this.pause()
    this.onUpdateCallback = null
  }
}
