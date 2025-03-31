import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { EnumDropdown } from '@hedron/ui-core'
import type { EnumDropdownHandle } from '@hedron/ui-core'
import { engineStore, useEngineStore } from '@renderer/engine'
import { useOnParamValueChange } from '@components/hooks/useOnParamValueChange'

interface ParamEnumProps {
  id: string
}

const useParamEnumOptions = (paramNodeId: string) => {
  const options = useEngineStore((state) => {
    const node = state.params[paramNodeId]
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
  const onValueChange = useOnParamValueChange(id)
  const options = useParamEnumOptions(id)

  useInterval(() => {
    const paramValue = engineStore.getState().paramValues[id]
    if (typeof paramValue !== 'string') {
      throw new Error('ParamEnum value was not a string')
    }
    ref.current?.setValue(paramValue)
  }, 100)

  return <EnumDropdown ref={ref} onValueChange={onValueChange} values={options} />
}
