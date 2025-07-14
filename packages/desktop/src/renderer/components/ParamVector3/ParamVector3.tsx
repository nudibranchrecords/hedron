import { useRef } from 'react'
import { NodeParamVector3 } from '@hedron/engine'
import { FloatSlider } from '@hedron/ui-core'
import type { FloatSliderHandle } from '@hedron/ui-core'
import c from './ParamVector3.module.css'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { useEngineStore } from '@renderer/engine'
import { useSubscribeToNodeValue } from '@components/hooks/useSubscribeToNodeValue'

interface ParamVector3Props {
  id: string
}

const SingleSlider = ({ id }: ParamVector3Props) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useSubscribeToNodeValue<number>(id, (value) => {
    ref.current?.updateValue(value)
  })

  return <FloatSlider ref={ref} onValueChange={onValueChange} />
}

export const ParamVector3 = ({ id }: ParamVector3Props) => {
  const node = useEngineStore((state) => state.nodes[id] as NodeParamVector3)

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
