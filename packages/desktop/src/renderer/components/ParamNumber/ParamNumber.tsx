import { useRef } from 'react'
import { ControlGrid, FloatSlider } from '@hedron/ui-core'
import type { FloatSliderHandle } from '@hedron/ui-core'
import { NodeParamNumber } from '@hedron/engine'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { useEngineStore } from '@renderer/engine'
import { useSubscribeToNodeValue } from '@components/hooks/useSubscribeToNodeValue'
import { OptionNumber } from '@components/OptionNumber/OptionNumber'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  const minValue = useEngineStore((state) => state.nodeValues[`${id}-sliderMin`])
  const maxValue = useEngineStore((state) => state.nodeValues[`${id}-sliderMax`])

  useSubscribeToNodeValue<number>(id, (value) => {
    ref.current?.updateValue(value)
  })

  return (
    <FloatSlider
      min={minValue as number}
      max={maxValue as number}
      ref={ref}
      onValueChange={onValueChange}
    />
  )
}

export const ParamNumberOptions = (param: NodeParamNumber) => {
  return (
    <ControlGrid>
      <OptionNumber paramId={param.id} optionKey="sliderMin" optionTitle="Slider Min" />
      <OptionNumber paramId={param.id} optionKey="sliderMax" optionTitle="Slider Max" />
    </ControlGrid>
  )
}
