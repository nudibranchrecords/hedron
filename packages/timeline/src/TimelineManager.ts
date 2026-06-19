import { Clock } from '@hedron-gl/clock'
import type {
  TimelineManagerData,
  TimelineManagerTrack,
  Keyframe,
  TimelineManagerAudioTrack,
} from '@/types'

export type TrackValues = Record<string, boolean>

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
  private clock: Clock | null = null

  constructor(timeline: TimelineManagerData, clock?: Clock) {
    this.timelineData = timeline
    this.clock = clock ?? null
    this.buildCache()
  }

  private buildCache() {
    this.sortedKeyframesCache.clear()
    this.resetKeyframeIndexes()
    for (const track of this.timelineData.tracks) {
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

  private getTrackValue(track: TimelineManagerTrack): boolean {
    const sorted = this.sortedKeyframesCache.get(track.id) ?? []
    const startIndex = this.lastKeyframeIndex.get(track.id) ?? 0
    let value = startIndex > 0 ? sorted[startIndex - 1].value : false
    let lastIndex = startIndex
    for (let i = startIndex; i < sorted.length; i++) {
      if (sorted[i].time > this.position) break
      value = sorted[i].value
      lastIndex = i + 1
    }
    this.lastKeyframeIndex.set(track.id, lastIndex)
    return value
  }

  private computeValues(): TrackValues {
    const values: TrackValues = {}
    for (const track of this.timelineData.tracks) {
      values[track.id] = this.getTrackValue(track)
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
    return this.timelineData.tracks
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
      this.playing = false
      this.lastFrameTime = null
      this.resetKeyframeIndexes()
      return
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  play() {
    if (this.playing) return

    if (this.clock) {
      this.clock.continue()
    }

    if (this.position >= this.timelineData.durationMs) {
      this.position = 0
      this.resetKeyframeIndexes()

      if (this.clock) {
        this.clock.beatDeltaMs = 0
      }
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
      console.log(timeMs)
      this.clock.beatDeltaMs = timeMs
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
