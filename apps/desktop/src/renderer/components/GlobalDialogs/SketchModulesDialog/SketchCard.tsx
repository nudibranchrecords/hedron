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

import { useSetSelectedSketchId } from '@components/hooks/useSetSelectedSketchId'
import { useAppStore } from '@renderer/appStore'

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
  const setSelectedSketchId = useSetSelectedSketchId()
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const addSketchToScene = useEngineStore((state) => state.addSketchToScene)

  const onButtonClick = useCallback(() => {
    if (!selectedSceneId) {
      return
    }

    const id = addSketchToScene(selectedSceneId, moduleId)
    setSelectedSketchId(id)
    closeDialog()
  }, [selectedSceneId, addSketchToScene, closeDialog, moduleId, setSelectedSketchId])

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
        <Button onClick={onButtonClick} iconName="add" disabled={!selectedSceneId}>
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}
