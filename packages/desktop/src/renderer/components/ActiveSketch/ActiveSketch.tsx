import {
  Button,
  ViewHeader,
  Card,
  CardActions,
  Icon,
  paramIcon,
  Panel,
  PanelBody,
  PanelHeader,
} from '@hedron/ui-core'
import c from './ActiveSketch.module.css'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { engineStore } from '@renderer/engine'
import { SketchParams } from '@components/SketchParams/SketchParams'
import { useSelectedParam } from '@components/hooks/useSelectedParam'
import { SelectedParam } from '@components/SelectedParam/SelectedParam'

export const ActiveSketch = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('ActiveSketch component: No activesketch found')
  }

  const selectedParam = useSelectedParam()

  return (
    <>
      <ViewHeader>
        <Icon name="token" /> {activeSketch.title}
      </ViewHeader>
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
      {selectedParam && (
        <Panel snugPosition="bottom" spacing="slim" width="full" className={c.bottomPanel}>
          <PanelHeader iconName={paramIcon}>{selectedParam.title}</PanelHeader>
          <PanelBody>
            <SelectedParam />
          </PanelBody>
        </Panel>
      )}
    </>
  )
}
