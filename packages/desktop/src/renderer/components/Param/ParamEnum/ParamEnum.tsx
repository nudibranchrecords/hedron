import { useRef } from 'react'
import { EnumDropdown } from '@hedron/ui-core'
import type { EnumDropdownHandle } from '@hedron/ui-core'
import { useEngineStore } from '@renderer/engine'
import { useOnNodeValueChange } from '@renderer/components/hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@components/hooks/useSubscribeToNodeValue'

interface ParamEnumProps {
  id: string
}

const useParamEnumOptions = (paramNodeId: string) => {
  const options = useEngineStore((state) => {
    const node = state.nodes[paramNodeId]
    const sketch = state.sketches[node.sketchId]
    const module = state.sketchModules[sketch.moduleId]

    const paramConfig = module.config.params.find((param) => param.key === node.key)

    if (paramConfig?.valueType !== 'enum') {
      throw new Error('Node id did not match enum type')
    }

    return paramConfig.options
  })

  return options
}

export const ParamEnum = ({ id }: ParamEnumProps) => {
  const ref = useRef<EnumDropdownHandle>(null)
  const onValueChange = useOnNodeValueChange(id)
  const options = useParamEnumOptions(id)

  useSubscribeToNodeValue<string>(id, (value) => {
    ref.current?.setValue(value)
  })

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={options} />
}
