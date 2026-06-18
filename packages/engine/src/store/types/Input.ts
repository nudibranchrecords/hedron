import { NodeBase } from './NodeBase'

export interface Input extends NodeBase {
  nodeType: 'input'
  inputType: string
  targetNodeId: string
}
