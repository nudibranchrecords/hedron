import { useCallback } from 'react'
import { SketchModuleItem } from '@hedron-gl/engine'
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  useEngineStore,
} from '@hedron-gl/ui-core'

import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'

interface SketchCardProps {
  item: SketchModuleItem
  closeDialog: () => void
}

export const SketchCard = ({
  item: {
    moduleId,
    config: { nodes, title, description },
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

  const numParams = nodes.filter((n) => n.nodeType === 'param').length
  const numShots = nodes.filter((n) => n.nodeType === 'shot').length

  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">{title}</CardHeader>
        <CardDetails>
          Params: {numParams} • Shots: {numShots}
        </CardDetails>
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
