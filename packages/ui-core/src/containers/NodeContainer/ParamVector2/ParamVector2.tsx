import { useRef } from 'react'
import { NodeParamVector2 } from '@hedron-gl/engine'
import c from './ParamVector2.module.css'
import { FloatSlider, FloatSliderHandle } from '@components/FloatSlider/FloatSlider'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { useEngineStore } from '@hooks/storeHooks'

interface ParamVector2Props {
  id: string
}

const SingleSlider = ({ id }: ParamVector2Props) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useSubscribeToNodeValue<number>(id, (value) => {
    ref.current?.updateValue(value)
  })

  return <FloatSlider ref={ref} onValueChange={onValueChange} />
}

export const ParamVector2 = ({ id }: ParamVector2Props) => {
  const node = useEngineStore((state) => state.nodes[id] as NodeParamVector2)

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
