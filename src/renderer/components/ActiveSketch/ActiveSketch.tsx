import c from './ActiveSketch.module.css'
import { Button } from '../core/Button/Button'
import { useActiveSketch } from '../hooks/useActiveSketch'
import { SketchParams } from '../SketchParams/SketchParams'
import { ViewHeader } from '../core/ViewHeader/ViewHeader'
import { engineStore } from 'src/renderer/engine'
import { Card, CardActions } from '../core/Card/Card'

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  return (
    <>
      <ViewHeader>Sketch: {activeSketch.title}</ViewHeader>
      <div className={c.section}>
        <SketchParams />
      </div>
      <Card>
        <CardActions>
          <Button
            type="danger"
            iconName="delete"
            onClick={() => engineStore.getState().deleteSketch(activeSketch.id)}
          >
            Delete Sketch
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
