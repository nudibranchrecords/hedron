import { SceneNode, ACTIVE_SCENE_ID_NODE_ID } from '@hedron-gl/engine'
import {
  Button,
  ControlGrid,
  NodeContainer,
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  useAppStore,
  useEngineStore,
  useEngineStoreShallow,
} from '@hedron-gl/ui-core'
import { useEffect } from 'react'

import c from './SceneControlGlobalPanel.module.css'

export const SceneControlGlobalPanel = () => {
  const addScene = useEngineStore((state) => state.addScene)

  const updateParamValue = useEngineStore((state) => state.updateParamValue)

  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const setSelectedSceneId = useAppStore((state) => state.setSelectedSceneId)

  const scenes = useEngineStoreShallow((state) =>
    state.sceneIds
      .map((id) => state.nodes[id])
      .filter((node): node is SceneNode => node?.nodeType === 'scene'),
  )

  const handleAddScene = () => {
    const newSceneId = addScene()
    setSelectedSceneId(newSceneId)
  }

  useEffect(() => {
    updateParamValue(ACTIVE_SCENE_ID_NODE_ID, selectedSceneId ?? '')
  }, [selectedSceneId, updateParamValue])

  return (
    <div className={c.wrapper}>
      <NodeContainer nodeId={ACTIVE_SCENE_ID_NODE_ID} />

      <ControlGrid className={c.list}>
        {scenes.map((scene) => {
          const isActive = scene.id === selectedSceneId
          return (
            <NodeControl
              key={scene.id}
              isActive={isActive}
              onClick={() => setSelectedSceneId(scene.id)}
            >
              <NodeControlMain>
                <NodeControlTitle>{scene.title}</NodeControlTitle>
              </NodeControlMain>
            </NodeControl>
          )
        })}
      </ControlGrid>
      <div className={c.actions}>
        <Button type="secondary" size="slim" iconName="add" onClick={handleAddScene}>
          Add Scene
        </Button>
      </div>
    </div>
  )
}
