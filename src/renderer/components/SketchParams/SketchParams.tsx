import { ControlGrid } from '../core/ControlGrid/ControlGrid'
import { FloatSlider, FloatSliderHandle } from '../core/FloatSlider/FloatSlider'
import {
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '../core/NodeControl/NodeControl'
import { ParamWithInfo, useActiveSketchParams } from '../hooks/useActiveSketchParams'
import { useCallback, useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { engineStore } from 'src/renderer/engine'
import { useUpdateNodeValue } from '../hooks/useUpdateNodeValue'
import { NodeTypes, NodeValue } from 'src/engine/store/types'
import { BooleanToggle } from '../core/BooleanToggle/BooleanToggle'

interface ParamProps {
  param: ParamWithInfo
}

const getInputElement = (valueType: NodeTypes, onValueChange: (value: NodeValue) => void, ref: React.RefObject<FloatSliderHandle>) => {
  switch (valueType) {
    case NodeTypes.Number:
      return <FloatSlider ref={ref} onValueChange={onValueChange} />
    case NodeTypes.Boolean:
      return <BooleanToggle ref={ref} onValueChange={onValueChange} />
    default:
      return <i>`Unsupported type ${valueType}`</i>
  }
}

const ParamItem = ({ param: { key, title, id, valueType } }: ParamProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const updateNodeValue = useUpdateNodeValue()

  const onValueChange = useCallback(
    (value: NodeValue) => {
      updateNodeValue(id, value)
    },
    [id, updateNodeValue],
  )

  // TODO: useAnimationFrame?
  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id];
    switch (typeof nodeValue) {
      case NodeTypes.Number:
        ref.current?.drawBar(nodeValue);
        break;
      default:
        break;
    }
  }, 100)
  return (
    <NodeControl key={key}>
      <NodeControlMain>
        <NodeControlTitle>{title ?? key}</NodeControlTitle>
        <NodeControlInner>
          {getInputElement(valueType, onValueChange, ref)}
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
