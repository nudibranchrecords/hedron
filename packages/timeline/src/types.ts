import { InputNode, CustomNode, ParamValueType, ParamValue } from '@hedron-gl/engine'

export interface Keyframe {
  id: string
  time: number
  // TODO: This is a bit wonky because a keyframe could be typed with a non-matching valueType and value
  // 'shot' isn't a ParamValueType since shots aren't params - their keyframes are momentary
  // triggers rather than held values.
  valueType: ParamValueType | 'shot'
  value: ParamValue
}

/** Store node type for a timeline track */
export type TimelineTrackInput = InputNode & {
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
