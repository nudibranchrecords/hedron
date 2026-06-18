import { NodeBase, ConfigNodeBase } from './NodeBase'

export type Shot = NodeBase & {
  nodeType: 'shot'
  key: string
  hidden?: boolean
  groupIndex: number
}

export interface ConfigShot extends ConfigNodeBase {
  nodeType: 'shot'
}

export interface ConfigShotImported extends ConfigShot {
  groupIndex: number
  title: string
  nodeType: 'shot'
}
