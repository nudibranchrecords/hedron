import {
  InputNode,
  CustomNode,
  ParamForValueType,
  ParamNonVectorValueType,
} from '@hedron-gl/engine'

type KeyframeValueType = Exclude<ParamNonVectorValueType, null>

type KeyframeBase = {
  id: string
  time: number
}

type KeyframeForValueType<TValueType extends KeyframeValueType> = KeyframeBase & {
  nodeType: 'param'
  valueType: TValueType
  value: ParamForValueType<TValueType>['defaultValue']
}

export type KeyframeParam = {
  [TValueType in KeyframeValueType]: KeyframeForValueType<TValueType>
}[KeyframeValueType]

export type KeyframeShot = KeyframeBase & {
  nodeType: 'shot'
}

export type Keyframe = KeyframeParam | KeyframeShot

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
