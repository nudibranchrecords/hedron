import c from './ActiveSketch.module.css'
import { SketchParams } from '@components/SketchParams/SketchParams'
import { engineStore } from '@renderer/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { Button } from '@components/core/Button/Button'
import { ViewHeader } from '@components/core/ViewHeader/ViewHeader'
import { Card, CardActions } from '@components/core/Card/Card'
import { Icon, paramIcon } from '@components/core/Icon/Icon'
import { Panel, PanelBody, PanelHeader } from '@components/core/Panel/Panel'
import { useSelectedParam } from '@components/hooks/useSelectedParam'

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
          <PanelBody>:)</PanelBody>
        </Panel>
      )}
    </>
  )
}
