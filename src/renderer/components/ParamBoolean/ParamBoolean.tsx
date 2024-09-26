import { useRef } from 'react'
import { useOnNodeValueChange } from '../hooks/useOnNodeValueChange'
import { useInterval } from 'usehooks-ts'
import { engineStore } from 'src/renderer/engine'
import { BooleanToggle, BooleanToggleHandle } from '../core/BooleanToggle/BooleanToggle'

interface ParamNumberProps {
  id: string
}

export const ParamBoolean = ({ id }: ParamNumberProps) => {
  const ref = useRef<BooleanToggleHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useInterval(() => {
    const nodeValue = engineStore.getState().nodeValues[id]
    if (typeof nodeValue !== 'boolean') {
      throw new Error('BooleanToggle value was not a boolean')
    }
    ref.current?.setChecked(nodeValue)
  }, 100)

  return <BooleanToggle ref={ref} onValueChange={onValueChange} />
}
