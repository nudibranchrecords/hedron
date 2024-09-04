import { ControlGrid } from '../core/ControlGrid/ControlGrid'
import { NodeControl } from '../core/NodeControl/NodeControl'
import { useActiveSketchParams } from 'src/renderer/store/hooks/useActiveSketchParams'

export const SketchParams = () => {
  const params = useActiveSketchParams()

  return (
    <ControlGrid>
      {params.map(({ key, title }) => (
        <NodeControl key={key} title={title ?? key} />
      ))}
    </ControlGrid>
  )
}
