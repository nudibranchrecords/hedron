import { Input, CustomNode } from '@hedron-gl/engine'

export interface Keyframe {
  id: string
  time: number
  valueType: 'boolean'
  value: boolean
}

/** Store node type for a timeline track */
export type TimelineTrackInput = Input & {
  inputType: 'timeline-track'
  customData?: {
    keyframes: Keyframe[]
  }
}

interface TimelineManagerTrackBase {
  id: string
  label: string
}

export interface TimelineManagerKeyframeTrack extends TimelineManagerTrackBase {
  trackType: 'keyframe'
  keyframes: Keyframe[]
  targetNodeId?: string
}

export interface TimelineManagerAudioTrack extends TimelineManagerTrackBase {
  trackType: 'audio'
  audioUrl: string
}

export type TimelineManagerTrack = TimelineManagerKeyframeTrack | TimelineManagerAudioTrack

export interface TimelineManagerData {
  durationMs: number
  tracks: TimelineManagerTrack[]
}

export interface TimelineNode extends CustomNode {
  customNodeType: 'timeline'
  childGroups: CustomNode['childGroups'] & {
    trackIds: string[]
  }
}
