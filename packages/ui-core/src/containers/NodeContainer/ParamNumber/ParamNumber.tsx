import { useRef } from 'react'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useEngineStore } from '@hooks/engineHooks'
import { useSubscribeToParamValue } from '@hooks/useSubscribeToParamValue'
import { OptionNumber } from '@containers/NodeContainer/OptionNumber/OptionNumber'
import { FloatSlider, FloatSliderHandle } from '@components/FloatSlider/FloatSlider'
import { ControlGrid } from '@components/ControlGrid/ControlGrid'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnParamValueChange(id)

  const minValue = useEngineStore((state) => state.paramValues[`${id}-sliderMin`])
  const maxValue = useEngineStore((state) => state.paramValues[`${id}-sliderMax`])

  useSubscribeToParamValue<number>(id, (value) => {
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

export const ParamNumberOptions = ({ id }: ParamNumberProps) => {
  return (
    <ControlGrid>
      <OptionNumber paramId={id} optionKey="sliderMin" optionTitle="Slider Min" />
      <OptionNumber paramId={id} optionKey="sliderMax" optionTitle="Slider Max" />
    </ControlGrid>
  )
}
