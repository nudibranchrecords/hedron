import { CustomNode } from '@hedron-gl/engine'

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

export interface TimelineNode extends CustomNode {
  nodeType: 'timeline'
  customData: {
    durationMs: number
  }
  childGroups: CustomNode['childGroups'] & {
    trackIds: string[]
  }
}
