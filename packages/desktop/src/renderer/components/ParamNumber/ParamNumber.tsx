import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { FloatSlider } from '@hedron/ui-core'
import type { FloatSliderHandle } from '@hedron/ui-core'
import { useOnParamValueChange } from '@components/hooks/useOnParamValueChange'
import { engineStore } from '@renderer/engine'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnParamValueChange(id)

  useInterval(() => {
    const paramValue = engineStore.getState().paramValues[id]
    if (typeof paramValue !== 'number') {
      throw new Error('ParamNumber value was not a number')
    }
    ref.current?.drawBar(paramValue)
  }, 100)

  return <FloatSlider ref={ref} onValueChange={onValueChange} />
}
