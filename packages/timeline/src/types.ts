import { Input, CustomNode, ParamValueType, ParamValue } from '@hedron-gl/engine'

export interface Keyframe {
  id: string
  time: number
  // TODO: This is a bit wonky because a keyframe could be typed with a non-matching valueType and value
  valueType: ParamValueType
  value: ParamValue
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

export interface TimelineManagerVectorTrack extends TimelineManagerTrackBase {
  trackType: 'vector'
  childTracks: TimelineManagerKeyframeTrack[]
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

export type TimelineManagerTrack =
  | TimelineManagerKeyframeTrack
  | TimelineManagerAudioTrack
  | TimelineManagerVectorTrack

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
