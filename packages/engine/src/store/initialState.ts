import { DEFAULT_SCENE_NODE_ID, EngineState } from '@store/types'

export const initialState: EngineState = {
  nodes: {
    [DEFAULT_SCENE_NODE_ID]: {
      id: DEFAULT_SCENE_NODE_ID,
      nodeType: 'scene',
      title: 'Scene 1',
      parentIds: [],
      childGroups: {
        optionNodeIds: [],
        inputNodeIds: [],
        sketchIds: [],
      },
    },
  },
  paramValues: {},
  sketchModules: {},
  resources: {},
  resourcesUrl: null,
}
