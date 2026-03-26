export interface Keyframe {
  /** Position on the timeline in milliseconds */
  time: number
  /** The value type determines how this keyframe behaves */
  valueType: 'boolean'
  /** Value of the keyframe (true/false for boolean type) */
  value: boolean
}

export interface TimelineTrack {
  /** Unique identifier for this track */
  id: string
  /** Display label */
  label: string
  /** Keyframes on this track */
  keyframes: Keyframe[]
}

export interface Timeline {
  /** Total duration in milliseconds */
  durationMs: number
  /** Tracks in the timeline */
  tracks: TimelineTrack[]
}
