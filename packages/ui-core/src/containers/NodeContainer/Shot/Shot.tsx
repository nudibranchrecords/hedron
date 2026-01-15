import { useRef } from 'react'
import { useOnNodeValueChange } from '@hooks/useOnNodeValueChange'
import { useSubscribeToNodeValue } from '@hooks/useSubscribeToNodeValue'
import { TriggerPad, TriggerPadHandle } from '@components/TriggerPad/TriggerPad'

interface ShotProps {
  id: string
}

export const Shot = ({ id }: ShotProps) => {
  const ref = useRef<TriggerPadHandle>(null)
  const onValueChange = useOnNodeValueChange(id)

  useSubscribeToNodeValue<boolean>(id, (value) => {
    if (value) {
      ref.current?.blink()
    }
  })

  return <TriggerPad ref={ref} onClick={() => onValueChange(performance.now())} />
}
