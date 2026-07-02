import { NodeBase } from './NodeBase'

export const DEFAULT_SCENE_NODE_ID = 'scene-main'

export interface SceneNode extends NodeBase {
  nodeType: 'scene'
  childGroups: NodeBase['childGroups'] & {
    sketchIds: string[]
  }
}
