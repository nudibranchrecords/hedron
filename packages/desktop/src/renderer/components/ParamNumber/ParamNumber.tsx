import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { FloatSlider, FloatSliderHandle } from '@components/core/FloatSlider/FloatSlider'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { engineStore } from '@renderer/engine'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'number') {
      throw new Error('ParamNumber value was not a number')
    }
    ref.current?.drawBar(nodeValue)
  }, 100)

  return <FloatSlider ref={ref} onValueChange={onValueChange} />
}
