import { useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useEngine } from '@hooks/engineHooks'
import { TextInput, TextInputHandle } from '@components/TextInput/TextInput'

interface ParamNumberProps {
  id: string
}

export const ParamString = ({ id }: ParamNumberProps) => {
  const ref = useRef<TextInputHandle>(null)
  const onValueChange = useOnParamValueChange(id)
  const engine = useEngine()

  useInterval(() => {
    const paramValue = engine.getStore().getState().paramValues[id]
    if (typeof paramValue !== 'string') {
      throw new Error('TextInput value was not a string')
    }
    ref.current?.setValue(paramValue)
  }, 100)

  return <TextInput ref={ref} onValueChange={onValueChange} />
}
