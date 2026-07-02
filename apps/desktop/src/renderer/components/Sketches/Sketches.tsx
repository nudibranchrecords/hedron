import {
  Icon,
  Panel,
  PanelBody,
  PanelHeader,
  ViewHeader,
  sceneIcon,
  useEngineStore,
} from '@hedron-gl/ui-core'
import { SceneNode } from '@hedron-gl/engine'
import c from './Sketches.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { ActiveSketch } from '@components/ActiveSketch/ActiveSketch'
import { SketchTabs } from '@components/SketchTabs/SketchTabs'
import { useAppStore } from '@renderer/appStore'

export const Sketches = () => {
  const activeSketch = useActiveSketch()
  const nodes = useEngineStore((state) => state.nodes)
  const activeSceneId = useAppStore((state) => state.activeSceneId)
  const activeScene = nodes[activeSceneId] as SceneNode

  return (
    <div className={c.wrapper}>
      <div className={c.main}>
        <ViewHeader>
          <Icon name={sceneIcon} /> {activeScene.title}
        </ViewHeader>
        {activeSketch ? (
          <ActiveSketch />
        ) : (
          <div className={c.intro}>
            <Panel>
              <PanelHeader iconName="info">Add A Sketch</PanelHeader>
              <PanelBody>
                Use the &quot;+&quot; button on the right to start adding sketches to your scene.
              </PanelBody>
            </Panel>
          </div>
        )}
      </div>
      <div className={c.nav}>
        <SketchTabs />
      </div>
    </div>
  )
}
