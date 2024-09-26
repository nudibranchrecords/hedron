import { FloatSlider, FloatSliderHandle } from '../core/FloatSlider/FloatSlider'
import { useRef } from 'react'
import { useOnNodeValueChange } from '../hooks/useOnNodeValueChange'
import { useInterval } from 'usehooks-ts'
import { engineStore } from 'src/renderer/engine'

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
