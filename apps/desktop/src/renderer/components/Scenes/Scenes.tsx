import { useMemo, useState } from 'react'
import {
  Button,
  Collapsible,
  ControlGrid,
  NodeControl,
  NodeControlMain,
  NodeControlTitle,
  useEngineStore,
} from '@hedron-gl/ui-core'
import { SceneNode } from '@hedron-gl/engine'
import c from './Scenes.module.css'
import { useAppStore } from '@renderer/appStore'

export const Scenes = () => {
  const [isOpen, setIsOpen] = useState(true)

  const nodes = useEngineStore((state) => state.nodes)
  const addScene = useEngineStore((state) => state.addScene)

  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const setSelectedSceneId = useAppStore((state) => state.setSelectedSceneId)

  const scenes = useMemo(() => {
    return Object.values(nodes)
      .filter((node): node is SceneNode => node?.nodeType === 'scene')
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [nodes])

  const handleAddScene = () => {
    const newSceneId = addScene()
    setSelectedSceneId(newSceneId)
  }

  return (
    <div className={c.wrapper}>
      <Collapsible title={`Scenes (${scenes.length})`} isOpen={isOpen} onToggle={setIsOpen}>
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
