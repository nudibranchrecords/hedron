import { useRef } from 'react'
import { useOnNodeValueChange } from '../hooks/useOnNodeValueChange'
import { useInterval } from 'usehooks-ts'
import { engineStore, useEngineStore } from 'src/renderer/engine'
import { EnumDropdown, EnumDropdownHandle } from '../core/EnumDropdown/EnumDropdown'

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

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'string') {
      throw new Error('ParamEnum value was not a string')
    }
    ref.current?.setValue(nodeValue)
  }, 100)

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={options} />
}
