import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { NodeParamRGB } from '@hedron/engine'
import c from './ParamRGB.module.css'
import { FloatSlider, FloatSliderHandle } from '@components/core/FloatSlider/FloatSlider'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { engineStore, useEngineStore } from '@renderer/engine'

interface ParamRGBProps {
  id: string
}

const SingleSlider = ({ id }: ParamRGBProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'number') {
      throw new Error('SingleSlider value was not a number')
    }
    ref.current?.drawBar(nodeValue)
  }, 100)

  return <FloatSlider ref={ref} onValueChange={onValueChange} />
}

export const ParamRGB = ({ id }: ParamRGBProps) => {
  const node = useEngineStore((state) => state.nodes[id] as NodeParamRGB)

  const { childNodeIds } = node

  return (
    <div className={c.container}>
      {childNodeIds.map((childId) => (
        <div key={childId} className={c.item}>
          <SingleSlider key={childId} id={childId} />
        </div>
      ))}
    </div>
  )
}
