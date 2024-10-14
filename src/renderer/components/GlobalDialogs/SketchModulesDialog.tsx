import { useCallback } from 'react'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { useEngineStore } from '@renderer/engine'
import { useSketchModuleList } from '@components/hooks/useSketchModuleList'
import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'
import { Dialog } from '@components/core/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader } from '@components/core/Panel/Panel'
import {
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
} from '@components/core/Card/Card'
import { Button } from '@components/core/Button/Button'
import { SketchModuleItem } from '@engine/store/types'

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
