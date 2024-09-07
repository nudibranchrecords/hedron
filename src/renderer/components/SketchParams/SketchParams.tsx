import { ControlGrid } from '../core/ControlGrid/ControlGrid'
import { FloatSlider, FloatSliderHandle } from '../core/FloatSlider/FloatSlider'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '../core/NodeControl/NodeControl'
import { useActiveSketchParams } from '../hooks/useActiveSketchParams'
import { Param } from 'src/engine'
import { useCallback, useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { engineStore } from 'src/renderer/engine'
import { useUpdateNodeValue } from '../hooks/useUpdateNodeValue'

interface ParamProps {
  param: Param
}

const ParamItem = ({ param: { key, title, id } }: ParamProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const updateNodeValue = useUpdateNodeValue()

  const onValueChange = useCallback(
    (value: number) => {
      updateNodeValue(id, value)
    },
    [id, updateNodeValue],
  )

  // TODO: useAnimationFrame?
  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    ref.current?.drawBar(nodeValue)
  }, 100)

  return (
    <NodeControl key={key}>
      <NodeControlMain>
        <NodeControlTitle>{title ?? key}</NodeControlTitle>
        <NodeControlInner>
          <FloatSlider onValueChange={onValueChange} ref={ref} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const SketchParams = () => {
  const params = useActiveSketchParams()

  return (
    <ControlGrid>
      {params.map((param) => (
        <ParamItem key={param.key} param={param} />
      ))}
    </ControlGrid>
  )
}
