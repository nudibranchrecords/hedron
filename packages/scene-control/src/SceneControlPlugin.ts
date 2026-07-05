import {
  listenToStore,
  ACTIVE_SCENE_ID_NODE_ID,
  HedronEngine,
  IPlugin,
  ParamEnum,
  SceneNode,
} from '@hedron-gl/engine'
import { sceneIcon } from '@hedron-gl/ui-core'

export class SceneControlPlugin implements IPlugin {
  public readonly id = 'scene-control'
  public readonly name = 'Scenes'
  public readonly iconName = sceneIcon
  public readonly description = 'Manages active scene selection UI state and options.'

  public onEngineInitialize(engine: HedronEngine) {
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
}
