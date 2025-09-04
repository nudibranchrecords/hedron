import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useEngineStoreWithContext } from '@hooks/useStores'
import { TextInput, TextInputHandle } from '@components/TextInput/TextInput'

interface ParamNumberProps {
  id: string
}

export const ParamString = ({ id }: ParamNumberProps) => {
  const ref = useRef<TextInputHandle>(null)
  const onValueChange = useOnNodeValueChange(id)
  const engineStore = useEngineStoreWithContext()

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'string') {
      throw new Error('TextInput value was not a string')
    }
    ref.current?.setValue(nodeValue)
  }, 100)

  return <TextInput ref={ref} onValueChange={onValueChange} />
}
