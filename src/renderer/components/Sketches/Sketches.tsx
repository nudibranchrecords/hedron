import c from './Sketches.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { ActiveSketch } from '@components/ActiveSketch/ActiveSketch'
import { Panel, PanelBody, PanelHeader } from '@components/core/Panel/Panel'
import { SketchTabs } from '@components/SketchTabs/SketchTabs'

export const Sketches = () => {
  const activeSketch = useActiveSketch()

  return (
    <div className={c.wrapper}>
      <div className={c.main}>
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
