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

/** Plain display/manager type — decoupled from the store */
export interface TimelineManagerTrack {
  id: string
  label: string
  keyframes: Keyframe[]
  targetNodeId?: string
}

export interface TimelineManagerData {
  durationMs: number
  tracks: TimelineManagerTrack[]
}

export interface TimelineNode extends CustomNode {
  nodeType: 'timeline'
  customData: {
    durationMs: number
  }
  childGroups: CustomNode['childGroups'] & {
    trackIds: string[]
  }
}
