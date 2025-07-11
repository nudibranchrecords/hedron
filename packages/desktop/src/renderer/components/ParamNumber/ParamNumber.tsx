import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { FloatSlider } from '@hedron/ui-core'
import type { FloatSliderHandle } from '@hedron/ui-core'
import { NodeParamNumber } from '@hedron/engine'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { engineStore, useEngineStore } from '@renderer/engine'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const prevVal = useRef<number | null>(null)

  const onValueChange = useOnNodeValueChange(id)

  // const node = useEngineStore((state) => state.nodes[id] as NodeParamNumber)

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (nodeValue === prevVal.current) {
      return
    }
    if (typeof nodeValue !== 'number') {
      throw new Error('ParamNumber value was not a number')
    }
    ref.current?.updateValue(nodeValue)
    prevVal.current = nodeValue
  }, 16)

  return (
    <FloatSlider
      // min={node.sliderMin}
      // max={node.sliderMax}
      ref={ref}
      onValueChange={onValueChange}
    />
  )
}
