import { useRef } from 'react'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { BooleanToggle, BooleanToggleHandle } from '@components/BooleanToggle/BooleanToggle'

interface ParamNumberProps {
  id: string
}

export const ParamBoolean = ({ id }: ParamNumberProps) => {
  const ref = useRef<BooleanToggleHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useSubscribeToNodeValue<boolean>(id, (value) => {
    ref.current?.setChecked(value)
  })

  return <BooleanToggle ref={ref} onValueChange={onValueChange} />
}
