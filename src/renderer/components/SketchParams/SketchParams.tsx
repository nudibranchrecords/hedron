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

interface ParamProps {
  param: ParamWithInfo
}

// TODO: param types (currently just floats!)
const ParamItem = ({ param: { key, title, id, valueType } }: ParamProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const updateNodeValue = useUpdateNodeValue()

  const onValueChange = useCallback(
    (value: NodeValue) => {
      switch (valueType) {
        case NodeTypes.Number:
          updateNodeValue(id, value)
          break
        case NodeTypes.Boolean:
          updateNodeValue(id, (value as number) > 0.5)
          break
        default:
          throw new Error(`Unsupported valueType: ${valueType}`)
      }
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
      case NodeTypes.Boolean:
        //ref.current?.drawBar(nodeValue ? 1 : 0);
        break;
      default:
        // Handle other types if necessary
        break;
    }
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
