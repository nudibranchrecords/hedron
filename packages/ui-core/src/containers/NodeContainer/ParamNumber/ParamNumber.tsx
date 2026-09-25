import { useEffect, useRef } from 'react'
import type { ParamNumber as ParamNumberType } from '@hedron-gl/engine'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useEngineStore } from '@hooks/engineHooks'
import { useSubscribeToParamValue } from '@hooks/useSubscribeToParamValue'
import { FloatSlider } from '@components/FloatSlider/FloatSlider'
import { NumberInput } from '@components/NumberInput/NumberInput'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<{ updateValue: (value: number) => void }>(null)
  const onValueChange = useOnParamValueChange(id)

  const minValue = useEngineStore((state) => state.paramValues[`${id}-sliderMin`])
  const maxValue = useEngineStore((state) => state.paramValues[`${id}-sliderMax`])
  const param = useEngineStore((state) => state.nodes[id]) as ParamNumberType
  const displayMode = param.displayMode

  useSubscribeToParamValue<number>(id, (value) => {
    ref.current?.updateValue(value)
  })

  return displayMode === 'field' ? (
    <NumberInput ref={ref} onValueChange={onValueChange} />
  ) : (
    <FloatSlider
      min={minValue as number}
      max={maxValue as number}
      ref={ref}
      onValueChange={onValueChange}
    />
  )
}
