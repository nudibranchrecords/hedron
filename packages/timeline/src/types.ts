export interface Keyframe {
  id: string
  time: number
  valueType: 'boolean'
  value: boolean
}

export interface TimelineTrack {
  id: string
  label: string
  keyframes: Keyframe[]
}

export interface Timeline {
  durationMs: number
  tracks: TimelineTrack[]
}
