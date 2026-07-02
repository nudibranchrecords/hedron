import { useEffect, useState } from 'react'
import {
  Button,
  Collapsible,
  ControlGrid,
  NodeContainer,
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  useEngineStore,
  useEngineStoreShallow,
} from '@hedron-gl/ui-core'
import { SceneNode, ACTIVE_SCENE_ID_NODE_ID } from '@hedron-gl/engine'
import c from './Scenes.module.css'
import { useAppStore } from '@renderer/appStore'

export const Scenes = () => {
  const [isOpen, setIsOpen] = useState(true)

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
      <Collapsible title={`Scenes (${scenes.length})`} isOpen={isOpen} onToggle={setIsOpen}>
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
      </Collapsible>
    </div>
  )
}
