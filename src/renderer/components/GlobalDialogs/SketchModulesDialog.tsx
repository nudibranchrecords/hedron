import { useCallback } from 'react'
import { Dialog } from '../core/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader } from '../core/Panel/Panel'
import { useSketchModuleList } from '../hooks/useSketchModuleList'
import { useSetActiveSketchId } from '../hooks/useSetActiveSketchId'
import {
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
} from '../core/Card/Card'
import { Button } from '../core/Button/Button'
import { GlobalDialogProps } from './types'
import { useEngineStore } from 'src/renderer/engine'
import { SketchModuleItem } from 'src/engine/store/types'

interface SketchCardProps {
  item: SketchModuleItem
  closeDialog: () => void
}

export const SketchCard = ({
  item: {
    moduleId,
    config: { params, title, description },
  },
  closeDialog,
}: SketchCardProps) => {
  const setActiveSketchId = useSetActiveSketchId()
  const addSketch = useEngineStore((state) => state.addSketch)

  const onButtonClick = useCallback(() => {
    const id = addSketch(moduleId)
    setActiveSketchId(id)
    closeDialog()
  }, [addSketch, closeDialog, moduleId, setActiveSketchId])

  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">{title}</CardHeader>
        <CardDetails>Params: {params.length}</CardDetails>
        {description && (
          <CardBody>
            <p>{description}</p>
          </CardBody>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={onButtonClick} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const SketchModulesDialog = ({ closeDialog }: GlobalDialogProps) => {
  const sketchModules = useSketchModuleList()

  return (
    <Dialog onBackgroundClick={closeDialog}>
      <Panel size="full" style={{ maxWidth: '60rem' }}>
        <PanelHeader iconName="add_circle" buttonOnClick={closeDialog}>
          Add sketch to scene
        </PanelHeader>
        <PanelBody>
          <CardList>
            {sketchModules.map((item) => (
              <SketchCard key={item.moduleId} item={item} closeDialog={closeDialog} />
            ))}
          </CardList>
        </PanelBody>
      </Panel>
    </Dialog>
  )
}
