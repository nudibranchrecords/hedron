import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { BooleanToggle } from '@hedron/ui-core'
import type { BooleanToggleHandle } from '@hedron/ui-core'
import { useOnParamValueChange } from '@components/hooks/useOnParamValueChange'
import { engineStore } from '@renderer/engine'

interface ParamNumberProps {
  id: string
}

export const ParamBoolean = ({ id }: ParamNumberProps) => {
  const ref = useRef<BooleanToggleHandle>(null)
  const onValueChange = useOnParamValueChange(id)

  useInterval(() => {
    const paramValue = engineStore.getState().paramValues[id]
    if (typeof paramValue !== 'boolean') {
      throw new Error('BooleanToggle value was not a boolean')
    }
    ref.current?.setChecked(paramValue)
  }, 100)

  return <BooleanToggle ref={ref} onValueChange={onValueChange} />
}
