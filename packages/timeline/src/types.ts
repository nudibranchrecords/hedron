import {
  InputNode,
  CustomNode,
  ParamForValueType,
  ParamNonVectorValueType,
} from '@hedron-gl/engine'

type KeyframeValueType = Exclude<ParamNonVectorValueType, null>

type KeyframeForValueType<TValueType extends KeyframeValueType> = {
  id: string
  time: number
  valueType: TValueType
  value: ParamForValueType<TValueType>['defaultValue']
}

export type Keyframe = {
  [TValueType in KeyframeValueType]: KeyframeForValueType<TValueType>
}[KeyframeValueType]

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
