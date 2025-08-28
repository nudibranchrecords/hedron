import { useRef } from 'react'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useEngineStore } from '@hooks/store'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { OptionNumber } from '@containers/Param/OptionNumber/OptionNumber'
import { FloatSlider, FloatSliderHandle } from '@components/FloatSlider/FloatSlider'
import { ControlGrid } from '@components/ControlGrid/ControlGrid'

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

export const ParamNumberOptions = ({ id }: ParamNumberProps) => {
  return (
    <ControlGrid>
      <OptionNumber paramId={id} optionKey="sliderMin" optionTitle="Slider Min" />
      <OptionNumber paramId={id} optionKey="sliderMax" optionTitle="Slider Max" />
    </ControlGrid>
  )
}
