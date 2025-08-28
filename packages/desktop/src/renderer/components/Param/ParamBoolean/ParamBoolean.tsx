import { useRef } from 'react'
import { BooleanToggle } from '@hedron/ui-core'
import type { BooleanToggleHandle } from '@hedron/ui-core'
import { useOnNodeValueChange } from '@components/hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@components/hooks/useSubscribeToNodeValue'

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
