import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { TextInput } from '@hedron/ui-core'
import type { TextInputHandle } from '@hedron/ui-core'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { engineStore } from '@renderer/engine'

interface ParamNumberProps {
  id: string
}

export const ParamString = ({ id }: ParamNumberProps) => {
  const ref = useRef<TextInputHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'string') {
      throw new Error('TextInput value was not a string')
    }
    ref.current?.setValue(nodeValue)
  }, 100)

  return <TextInput ref={ref} onValueChange={onValueChange} />
}
