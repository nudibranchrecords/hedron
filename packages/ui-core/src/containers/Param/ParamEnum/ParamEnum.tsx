import { useRef } from 'react'
import { NodeParamEnum } from '@hedron/engine'
import { useEngineStore } from '@hooks/useStores'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'

interface ParamEnumProps {
  id: string
}

export const ParamEnum = ({ id }: ParamEnumProps) => {
  const ref = useRef<EnumDropdownHandle>(null)
  const onValueChange = useOnNodeValueChange(id)
  const node = useEngineStore((state) => state.nodes[id]) as NodeParamEnum

  useSubscribeToNodeValue<string>(id, (value) => {
    ref.current?.setValue(value)
  })

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={node.options} />
}
