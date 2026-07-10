import { NodeBase, ConfigNodeBase } from './NodeBase'

export type CustomNode = NodeBase & {
  nodeType: 'custom'
  customNodeType: string
}

export type ConfigCustomNode = ConfigNodeBase & {
  nodeType: 'custom'
  customNodeType: string
}

export type ConfigCustomNodeImported = ConfigCustomNode & {
  groupIndex: number
  title: string
}
