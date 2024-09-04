import c from './WorkArea.module.css'
import { SketchTabs } from '../SketchTabs/SketchTabs'
import { Button } from '../core/Button'
import { addSketch } from 'src/renderer/store/actions/addSketch'
import { deleteSketch } from 'src/renderer/store/actions/deleteSketch'
import { setStoreProperty } from 'src/renderer/store/actions/setStoreProperty'
import { useSketchModuleList } from 'src/renderer/store/hooks/useSketchModuleList'
import { useActiveSketch } from 'src/renderer/store/hooks/useActiveSketch'
import { useActiveSketchParams } from 'src/renderer/store/hooks/useActiveSketchParams'

export const WorkArea = () => {
  const sketchModules = useSketchModuleList()
  const activeSketch = useActiveSketch()
  const params = useActiveSketchParams()

  return (
    <div className={c.wrapper}>
      <div>
        {activeSketch && (
          <>
            <h2>Sketch: {activeSketch.title}</h2>
            <ul>
              {params.map(({ key, title, value }) => (
                <li key={key}>
                  {title ?? key} - {value}
                </li>
              ))}
            </ul>
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
