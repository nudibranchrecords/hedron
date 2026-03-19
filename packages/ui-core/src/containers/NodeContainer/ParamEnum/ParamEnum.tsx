import { useRef } from 'react'
import { ParamEnum as ParamEnumType } from '@hedron-gl/engine'
import { useEngineStore } from '@hooks/storeHooks'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'

interface ParamEnumProps {
  id: string
}

export const ParamEnum = ({ id }: ParamEnumProps) => {
  const ref = useRef<EnumDropdownHandle>(null)
  const onValueChange = useOnNodeValueChange(id)
  const node = useEngineStore((state) => state.nodes[id]) as ParamEnumType

  useSubscribeToNodeValue<string>(id, (value) => {
    ref.current?.setValue(value)
  })

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={node.options} />
}
