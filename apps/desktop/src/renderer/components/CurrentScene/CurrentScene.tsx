import { Icon, ViewHeader, sceneIcon, useEngineStore } from '@hedron-gl/ui-core'
import { SceneNode } from '@hedron-gl/engine'
import { useAppStore } from '@renderer/appStore'
import { Sketches } from '@components/Sketches/Sketches'
import c from './CurrentScene.module.css'

export const CurrentScene = () => {
  const nodes = useEngineStore((state) => state.nodes)
  const activeSceneId = useAppStore((state) => state.activeSceneId)
  const activeScene = nodes[activeSceneId] as SceneNode

  return (
    <div className={c.wrapper}>
      <ViewHeader>
        <Icon name={sceneIcon} /> {activeScene.title}
      </ViewHeader>
      <div className={c.content}>
        <Sketches />
      </div>
    </div>
  )
}
