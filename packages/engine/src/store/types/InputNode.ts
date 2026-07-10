import { NodeBase } from './NodeBase'

export interface InputNode extends NodeBase {
  nodeType: 'input'
  inputType: string
  targetNodeId: string
}
