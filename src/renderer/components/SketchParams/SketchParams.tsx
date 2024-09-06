import { updateNodeValue } from 'src/renderer/store/actions/updateNodeValue'
import { ControlGrid } from '../core/ControlGrid/ControlGrid'
import { FloatSlider, FloatSliderHandle } from '../core/FloatSlider/FloatSlider'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '../core/NodeControl/NodeControl'
import { useActiveSketchParams } from 'src/renderer/store/hooks/useActiveSketchParams'
import { Param } from 'src/renderer/store/types'
import { useCallback, useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { useAppStore } from 'src/renderer/store/useAppStore'

interface ParamProps {
  param: Param
}

const ParamItem = ({ param: { key, title, id } }: ParamProps) => {
  const ref = useRef<FloatSliderHandle>(null)

  const onValueChange = useCallback(
    (value: number) => {
      updateNodeValue(id, value)
    },
    [id],
  )

  // TODO: useAnimationFrame?
  useInterval(() => {
    const nodeValue = useAppStore.getState().nodeValues[id]
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
