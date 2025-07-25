import { EnumOption } from '@hedron/engine'
import {
  BooleanToggle,
  BooleanToggleHandle,
  EnumDropdown,
  FloatSlider,
  FloatSliderHandle,
  NodeControl,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
} from '@hedron/ui-core'
import { useEffect, useRef } from 'react'

interface DropdownOption {
  type: 'dropdown'
  values: EnumOption[]
}

interface SliderOption {
  type: 'slider'
}

interface BooleanOption {
  type: 'boolean'
}

interface LFOOptionControlProps {
  label: string
  controlOption: DropdownOption | SliderOption | BooleanOption
  value: string | number | boolean
  onChange: (key: string, value: string | number | boolean) => void
}

export const LFOOptionControl = ({
  label,
  controlOption,
  onChange,
  value,
}: LFOOptionControlProps) => {
  const ref = useRef<FloatSliderHandle | BooleanToggleHandle>(null)

  // TODO: This is just a hack to display the value of sliders on first load
  useEffect(() => {
    if (controlOption.type === 'slider' && ref.current) {
      ref.current.updateValue(Number(value))
    }

    if (controlOption.type === 'boolean') {
      ref.current?.setChecked(Boolean(value))
    }
  })

  return (
    <NodeControl>
      <NodeControlMain>
        <NodeControlTitle>{label}</NodeControlTitle>
        <NodeControlInner>
          {controlOption.type === 'slider' && <FloatSlider ref={ref} onValueChange={onChange} />}
          {controlOption.type === 'dropdown' && (
            <EnumDropdown value={value} values={controlOption.values} onValueChange={onChange} />
          )}
          {controlOption.type === 'boolean' && (
            <BooleanToggle value={value} ref={ref} onValueChange={onChange} />
          )}
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}
