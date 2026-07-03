import { HedronEngine } from './HedronEngine'
import { ParamEnum, SceneNode } from '@store/types'
import { ACTIVE_SCENE_ID_NODE_ID } from '@constants'
import { listenToStore } from '@store/storeListener'

/** Scenes aren't plugins but we're still keeping the logic as separate as possible from the core */
export const setupScenes = (engine: HedronEngine) => {
  // Create the node for holding onto the active scene
  engine.addNodeOnce(ACTIVE_SCENE_ID_NODE_ID, null, {
    nodeType: 'param',
    title: 'Active Scene',
    key: ACTIVE_SCENE_ID_NODE_ID,
    valueType: 'enum',
    defaultValue: '',
    options: [],
  })

  const setState = engine.getStore().setState

  // Update the enum options whenever the sceneIds change
  listenToStore({
    store: engine.getStore(),
    onSceneAdded: (newSceneId) => {
      setState((state) => {
        const activeSceneEnumNode = state.nodes[ACTIVE_SCENE_ID_NODE_ID] as ParamEnum
        const sceneNode = state.nodes[newSceneId] as SceneNode
        activeSceneEnumNode.options.push({
          value: newSceneId,
          label: sceneNode.title,
        })
      })
    },
    onSceneRemoved: (removedSceneId) => {
      setState((state) => {
        const activeSceneEnumNode = state.nodes[ACTIVE_SCENE_ID_NODE_ID] as ParamEnum
        activeSceneEnumNode.options = activeSceneEnumNode.options.filter(
          (option) => option.value !== removedSceneId,
        )
      })
    },
  })
}
