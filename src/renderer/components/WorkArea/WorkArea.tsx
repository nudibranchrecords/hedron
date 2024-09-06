import c from './WorkArea.module.css'
import { SketchTabs } from '../SketchTabs/SketchTabs'
import { Button } from '../core/Button/Button'
import { addSketch } from 'src/renderer/engine/store/actions/addSketch'
import { deleteSketch } from 'src/renderer/engine/store/actions/deleteSketch'
import { setStoreProperty } from 'src/renderer/engine/store/actions/setStoreProperty'
import { useSketchModuleList } from 'src/renderer/engine/store/hooks/useSketchModuleList'
import { useActiveSketch } from 'src/renderer/engine/store/hooks/useActiveSketch'
import { SketchParams } from '../SketchParams/SketchParams'
import { ViewHeader } from '../core/ViewHeader/ViewHeader'

export const WorkArea = () => {
  const sketchModules = useSketchModuleList()
  const activeSketch = useActiveSketch()

  return (
    <div className={c.wrapper}>
      <div className={c.main}>
        {activeSketch && (
          <>
            <ViewHeader>Sketch: {activeSketch.title}</ViewHeader>
            <div className={c.section}>
              <SketchParams />
            </div>
            <Button onClick={() => deleteSketch(activeSketch.id)}>Delete </Button>
          </>
        )}

        <h2>Add Sketches</h2>
        <ul>
          {sketchModules.map(({ title, moduleId }) => (
            <li key={moduleId}>
              <button
                onClick={() => {
                  const id = addSketch(moduleId)
                  setStoreProperty('activeSketchId', id)
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
