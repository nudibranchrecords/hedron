import { useCallback } from 'react'
import { SketchModuleItem } from '@hedron/engine'
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
  Dialog,
  Panel,
  PanelBody,
  PanelHeader,
  useEngineStore,
} from '@hedron/ui-core'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { useSketchModuleList } from '@components/hooks/useSketchModuleList'
import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'

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
      <Panel width="full" height="full" style={{ maxWidth: '60rem' }}>
        <PanelHeader iconName="add_circle" buttonOnClick={closeDialog}>
          Add sketch to scene
        </PanelHeader>
        <PanelBody scrollable={true}>
          <CardList>
            {[...sketchModules]
              .sort((a, b) => a.config.title.localeCompare(b.config.title))
              .map((item) => (
                <SketchCard key={item.moduleId} item={item} closeDialog={closeDialog} />
              ))}
          </CardList>
        </PanelBody>
      </Panel>
    </Dialog>
  )
}
