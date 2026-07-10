import { useRef } from 'react'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useSubscribeToParamValue } from '@hooks/useSubscribeToParamValue'
import { BooleanToggle, BooleanToggleHandle } from '@components/BooleanToggle/BooleanToggle'

interface ParamNumberProps {
  id: string
}

export const ParamBoolean = ({ id }: ParamNumberProps) => {
  const ref = useRef<BooleanToggleHandle>(null)
  const onValueChange = useOnParamValueChange(id)

  useSubscribeToParamValue<boolean>(id, (value) => {
    ref.current?.setChecked(value)
  })

  return <BooleanToggle ref={ref} onValueChange={onValueChange} />
}
