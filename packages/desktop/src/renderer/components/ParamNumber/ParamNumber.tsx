import { useRef } from 'react'
import { FloatSlider } from '@hedron/ui-core'
import type { FloatSliderHandle } from '@hedron/ui-core'
import { NodeParamNumber } from '@hedron/engine'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { useEngineStore } from '@renderer/engine'
import { useSubscribeToNodeValue } from '@components/hooks/useSubscribeToNodeValue'

interface ParamNumberProps {
  id: string
}

export const ParamNumber = ({ id }: ParamNumberProps) => {
  const ref = useRef<FloatSliderHandle>(null)
  const onValueChange = useOnNodeValueChange(id)
  const node = useEngineStore((state) => state.nodes[id] as NodeParamNumber)

  useSubscribeToNodeValue<number>(id, (value) => {
    ref.current?.updateValue(value)
  })

  return (
    <FloatSlider
      min={node.sliderMin}
      max={node.sliderMax}
      ref={ref}
      onValueChange={onValueChange}
    />
  )
}

export const ParamNumberOptions = (param: NodeParamNumber) => {
  return (
    <div>
      <div>
        <label>
          Slider Min:
          <input
            className="input"
            type="number"
            value={param.sliderMin}
            // onChange={(e) => param.setSliderMin(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Slider Max:
          <input
            type="number"
            value={param.sliderMax}
            // onChange={(e) => param.setSliderMax(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}
