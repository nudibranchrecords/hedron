import { Clock } from '@hedron-gl/clock'
import { ParamValue } from '@hedron-gl/engine'
import type {
  TimelineManagerData,
  TimelineManagerTrack,
  Keyframe,
  TimelineManagerAudioTrack,
  TimelineManagerKeyframeTrack,
} from '@/types'

export type TrackValues = Record<string, ParamValue>

export type OnUpdateCallback = (values: TrackValues) => void

export class TimelineManager {
  private timelineData: TimelineManagerData
  private position = 0
  private playing = false
  private onUpdateCallback: OnUpdateCallback | null = null
  private cachedValues: TrackValues = {}
  private sortedKeyframesCache: Map<string, Keyframe[]> = new Map()
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private lastKeyframeIndex: Map<string, number> = new Map()
  private clock: Clock | null = null

  constructor(timeline: TimelineManagerData, clock?: Clock) {
    this.timelineData = timeline
    this.clock = clock ?? null
    this.buildCache()
  }

  private buildCache() {
    this.sortedKeyframesCache.clear()
    this.resetKeyframeIndexes()
    for (const track of this.getAllTracks()) {
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

  private getTrackValue(track: TimelineManagerKeyframeTrack): ParamValue | undefined {
    const sorted = this.sortedKeyframesCache.get(track.id) ?? []
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

  private computeValues(): TrackValues {
    const values: TrackValues = {}
    for (const track of this.getAllTracks()) {
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
    for (const key of Object.keys(newValues)) {
      if (this.cachedValues[key] !== newValues[key]) {
        changed[key] = newValues[key]
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
    return this.getAllTracks()
      .filter(
        (track): track is TimelineManagerAudioTrack =>
          track.trackType === 'audio' && this.audioCache.has(track.id),
      )
      .map((track) => ({
        track,
        audio: this.audioCache.get(track.id)!,
      }))
  }

  /**
   * Advances playback position by deltaMs. Called once per engine frame (via TimelineInput's
   * IPlugin.onFrame) while playing, for both real-time playback and fixed-framerate rendering.
   */
  step(deltaMs: number) {
    if (!this.playing) return

    this.position = Math.max(
      0,
      Math.min(this.position + deltaMs, this.timelineData.durationMs),
    )

    if (this.clock) {
      this.clock.beatDeltaMs = this.position
    }

    this.emitUpdate()

    if (this.position >= this.timelineData.durationMs) {
      this.goTo(0)
    }
  }

  getAllTracks(tracks = this.timelineData.tracks): TimelineManagerTrack[] {
    const allTracks: TimelineManagerTrack[] = []

    for (const track of tracks) {
      allTracks.push(track)
      if (track.trackType === 'vector') {
        allTracks.push(...this.getAllTracks(track.childTracks))
      }
    }

    return allTracks
  }

  /**
   * @param options.silent Skip starting audio track playback (used when rendering, where audio
   * is muxed in separately rather than played back live).
   */
  play(options?: { silent?: boolean }) {
    if (this.playing) return

    if (this.clock) {
      this.clock.beatDeltaMs = this.position
      this.clock.continue()
    }

    this.playing = true

    if (options?.silent) return

    // Play audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.currentTime = this.position / 1000
      audio.play()
    }
  }

  pause() {
    this.playing = false

    if (this.clock) {
      this.clock.stop()
    }

    // Pause audio tracks
    for (const { audio } of this.getAudioTracksWithAudio()) {
      audio.pause()
    }
  }

  goTo(timeMs: number) {
    this.position = Math.max(0, Math.min(timeMs, this.timelineData.durationMs))
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

  setDuration(durationMs: number) {
    this.timelineData.durationMs = durationMs
    this.position = Math.min(this.position, durationMs)
    this.emitUpdate()
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
