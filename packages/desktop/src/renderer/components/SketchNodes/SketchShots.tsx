import { fireShotOnSketch, NodeShotBase } from '@hedron/engine'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  ControlGrid,
  Button,
} from '@hedron/ui-core'
import { useOnSelectNode } from '@components/hooks/useOnSelectNode'
import { useActiveSketchShots } from '@components/hooks/useActiveSketchShots'
import { useSelectedNode } from '@components/hooks/useSelectedNode'

const ShotItem = ({ shot }: { shot: NodeShotBase & { title: string } }) => {
  const onSelectNode = useOnSelectNode(shot.sketchId, shot.id)
  const selected = useSelectedNode()?.id
  const onFireShot = () => {
    fireShotOnSketch(shot.sketchId, shot.key)
  }
  return (
    <NodeControl key={shot.key} onClick={onSelectNode} isActive={shot.id === selected}>
      <NodeControlMain>
        <Button onClick={onFireShot} type="neutral" style={{ width: '100%', height: '100%' }}>
          {shot.title}
        </Button>
      </NodeControlMain>
    </NodeControl>
  )
}

export const SketchShots = () => {
  const params = useActiveSketchShots()

  return (
    <ControlGrid>
      {params.map((param) => (
        <ShotItem shot={param} key={param.id} />
      ))}
    </ControlGrid>
  )
}
