import c from './WorkArea.module.css'
import { SketchTabs } from '../SketchTabs/SketchTabs'
import { Button } from '../core/Button/Button'
import { useSketchModuleList } from 'src/renderer/hooks/useSketchModuleList'
import { useActiveSketch } from 'src/renderer/hooks/useActiveSketch'
import { SketchParams } from '../SketchParams/SketchParams'
import { ViewHeader } from '../core/ViewHeader/ViewHeader'
import { engineStore } from 'src/renderer/engine'

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
                  engineStore.setState({ activeSketchId: id })
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
