import { NodeBase } from './NodeBase'

export const DEFAULT_SCENE_NODE_ID = 'scene-main'

export interface Scene extends NodeBase {
  nodeType: 'scene'
  childGroups: NodeBase['childGroups'] & {
    sketchIds: string[]
  }
}
