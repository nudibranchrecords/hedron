import c from './WorkArea.module.css'
import { SketchTabs } from '../SketchTabs/SketchTabs'
import { Button } from '../core/Button/Button'
import { useSketchModuleList } from '../hooks/useSketchModuleList'
import { useActiveSketch } from '../hooks/useActiveSketch'
import { SketchParams } from '../SketchParams/SketchParams'
import { ViewHeader } from '../core/ViewHeader/ViewHeader'
import { engineStore } from 'src/renderer/engine'
import { useSetActiveSketchId } from '../hooks/useSetActiveSketchId'

export const WorkArea = () => {
  const sketchModules = useSketchModuleList()
  const activeSketch = useActiveSketch()
  const setActiveSketchId = useSetActiveSketchId()

  return (
    <div className={c.wrapper}>
      <div className={c.main}>
        {activeSketch && (
          <>
            <ViewHeader>Sketch: {activeSketch.title}</ViewHeader>
            <div className={c.section}>
              <SketchParams />
            </div>
            <Button onClick={() => engineStore.getState().deleteSketch(activeSketch.id)}>
              Delete{' '}
            </Button>
          </>
        )}

        <h2>Add Sketches</h2>
        <ul>
          {sketchModules.map(({ title, moduleId }) => (
            <li key={moduleId}>
              <button
                onClick={() => {
                  const id = engineStore.getState().addSketch(moduleId)
                  setActiveSketchId(id)
                }}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={c.nav}>
        <SketchTabs />
      </div>
    </div>
  )
}
