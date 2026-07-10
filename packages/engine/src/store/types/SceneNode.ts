import { NodeBase } from './NodeBase'

export interface SceneNode extends NodeBase {
  nodeType: 'scene'
  childGroups: NodeBase['childGroups'] & {
    sketchIds: string[]
  }
}
