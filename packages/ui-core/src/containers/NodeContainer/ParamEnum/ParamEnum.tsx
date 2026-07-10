import { useRef } from 'react'
import { ParamEnum as ParamEnumType } from '@hedron-gl/engine'
import { useEngineStore } from '@hooks/engineHooks'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useSubscribeToParamValue } from '@hooks/useSubscribeToParamValue'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'

interface ParamEnumProps {
  id: string
}

export const ParamEnum = ({ id }: ParamEnumProps) => {
  const ref = useRef<EnumDropdownHandle>(null)
  const onValueChange = useOnParamValueChange(id)
  const node = useEngineStore((state) => state.nodes[id]) as ParamEnumType

  useSubscribeToParamValue<string>(id, (value) => {
    ref.current?.setValue(value)
  })

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={node.options} />
}
