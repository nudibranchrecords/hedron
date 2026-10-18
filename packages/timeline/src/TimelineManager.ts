import { Clock } from '@hedron-gl/clock'
import { ParamValue } from '@hedron-gl/engine'
import { TimelineAudioPlayer } from './TimelineAudioPlayer'
import type { OnAudioSourceChangeCallback, TimelineAudioLoadingMode } from './TimelineAudioPlayer'
import type {
  TimelineManagerTrack,
  Keyframe,
  TimelineManagerAudioTrack,
  TimelineManagerKeyframeTrack,
  KeyframeParam,
} from '@/types'

export type TrackValues = Record<string, ParamValue>

export type OnUpdateCallback = (values: TrackValues) => void

export type {
  OnAudioSourceChangeCallback,
  TimelineAudioState,
  TimelineAudioSource,
} from './TimelineAudioPlayer'

export class TimelineManager {
  private tracks: TimelineManagerTrack[]
  private durationMs: number
  private positionMs = 0
  private playing = false
  private onUpdateCallback: OnUpdateCallback | null = null
  private cachedValues: TrackValues = {}
  private sortedKeyframesCache: Map<string, Keyframe[]> = new Map()
  private lastKeyframeIndex: Map<string, number> = new Map()
  // Number of shot keyframes at or before the position as of the last check, per track.
  private shotKeyframeCount: Map<string, number> = new Map()
  private clock: Clock | null = null
  // Flattened (vector tracks expanded to their childTracks) view of `tracks`, kept in
  // sync by buildCache() - avoids re-walking the track tree on every computeValues/emitUpdate call.
  private flatTracks: TimelineManagerTrack[] = []
  private audioPlayer: TimelineAudioPlayer
  private disposed = false

  constructor({
    tracks,
    durationMs,
    clock,
    audioLoadingMode = 'preload',
  }: {
    tracks: TimelineManagerTrack[]
    durationMs: number
    clock?: Clock
    audioLoadingMode?: TimelineAudioLoadingMode
  }) {
    this.tracks = tracks
    this.durationMs = durationMs
    this.clock = clock ?? null
    this.audioPlayer = new TimelineAudioPlayer({
      audioLoadingMode,
      onPositionChange: (positionMs) => {
        this.positionMs = positionMs
      },
      onStateChange: (state) => {
        if (state === 'playing') {
          if (this.clock) {
            this.clock.beatDeltaMs = this.positionMs
            this.clock.continue()
          }
        } else if (this.playing) {
          this.clock?.stop()
        }
      },
      onError: () => {
        this.playing = false
        this.emitUpdate()
      },
    })
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
      if (track.trackType === 'keyframe') {
        this.sortedKeyframesCache.set(
          track.id,
          [...track.keyframes].sort((a, b) => a.time - b.time),
        )
      }
    }
    this.audioPlayer.setTracks(
      this.flatTracks.filter(
        (track): track is TimelineManagerAudioTrack => track.trackType === 'audio',
      ),
      this.durationMs,
    )
  }

  getAudioDiagnostics() {
    return this.audioPlayer.getDiagnostics(this.positionMs)
  }

  getAudioBuffer = (url: string) => this.audioPlayer.getAudioBuffer(url)

  subscribeAudioBuffers = (listener: () => void) => this.audioPlayer.subscribeAudioBuffers(listener)

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

  /**
   * Advances playback position by deltaMs. Called once per engine frame (via TimelineInput's
   * IPlugin.onFrame) while playing, for both real-time playback and fixed-framerate rendering.
   */
  step(deltaMs: number) {
    if (!this.playing) return

    this.audioPlayer.step(deltaMs, this.positionMs, this.durationMs)

    if (this.clock) {
      this.clock.beatDeltaMs = this.positionMs
    }

    this.emitUpdate()

    if (this.positionMs >= this.durationMs) {
      this.goTo(0)
    }
  }

  getAllTracks(): TimelineManagerTrack[] {
    return [...this.flatTracks]
  }

  /**
   * @param options.silent Skip starting audio track playback (used when rendering, where audio
   * is muxed in separately rather than played back live).
   */
  play(options?: { silent?: boolean }) {
    if (this.playing || this.disposed) return
    this.playing = true
    this.audioPlayer.play(this.positionMs, this.durationMs, options)
  }

  pause() {
    this.audioPlayer.pause()
    this.playing = false

    if (this.clock) {
      this.clock.stop()
    }
  }

  goTo(timeMs: number) {
    this.positionMs = Math.max(0, Math.min(timeMs, this.durationMs))
    this.audioPlayer.seek(this.positionMs, this.durationMs)
    this.resetKeyframeIndexes()

    if (this.clock) {
      this.clock.beatDeltaMs = this.positionMs
    }

    this.emitUpdate()
  }

  /**
   * Seeks to 0, then parks the playhead `offsetMs` before it (`goTo` clamps at 0), so advancing
   * by `offsetMs` lands exactly on 0 - e.g. fixed-framerate rendering, which advances before each frame renders.
   */
  goToBeforeStart(offsetMs: number) {
    this.goTo(0)
    this.positionMs = -offsetMs
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

  onAudioSourceChange(callback: OnAudioSourceChangeCallback) {
    this.audioPlayer.onAudioSourceChange(callback)
  }

  getPositionMs() {
    return this.positionMs
  }

  isPlaying() {
    return this.playing
  }

  dispose() {
    if (this.disposed) return
    this.pause()
    this.disposed = true
    this.audioPlayer.dispose()
    this.onUpdateCallback = null
  }
}
