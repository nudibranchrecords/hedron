import type { TimelineManagerData, TimelineManagerTrack, Keyframe } from '@/types'

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
  private lastKeyframeIndex: Map<string, number> = new Map()

  constructor(timeline: TimelineManagerData) {
    this.timelineData = timeline
    this.buildCache()
  }

  private buildCache() {
    this.sortedKeyframesCache.clear()
    this.resetKeyframeIndexes()
    for (const track of this.timelineData.tracks) {
      if (track.trackType !== 'keyframe') continue
      this.sortedKeyframesCache.set(
        track.id,
        [...track.keyframes].sort((a, b) => a.time - b.time),
      )
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

  private tick = (now: number) => {
    if (!this.playing) return

    if (this.lastFrameTime !== null) {
      const delta = now - this.lastFrameTime
      this.position = Math.min(this.position + delta, this.timelineData.durationMs)
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
    if (this.position >= this.timelineData.durationMs) {
      this.position = 0
      this.resetKeyframeIndexes()
    }
    this.playing = true
    this.lastFrameTime = null
    this.rafId = requestAnimationFrame(this.tick)
  }

  pause() {
    this.playing = false
    this.lastFrameTime = null
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  goTo(timeMs: number) {
    this.position = Math.max(0, Math.min(timeMs, this.timelineData.durationMs))
    this.lastFrameTime = null
    this.resetKeyframeIndexes()
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
