import { useRef } from 'react'
import { useEngineStore } from '@hooks/store'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { EnumDropdown, EnumDropdownHandle } from '@components/EnumDropdown/EnumDropdown'

interface ParamEnumProps {
  id: string
}

const useParamEnumOptions = (paramNodeId: string) => {
  const options = useEngineStore((state) => {
    console.log({ paramNodeId, state })
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
