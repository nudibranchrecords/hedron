import { useRef } from 'react'
import { useFireShot } from '@hooks/useFireShot'

import { TriggerPad, TriggerPadHandle } from '@components/TriggerPad/TriggerPad'
import { useSubscribeToShot } from '@hooks/useSubscribeToShot'

interface ShotProps {
  id: string
}

export const Shot = ({ id }: ShotProps) => {
  const ref = useRef<TriggerPadHandle>(null)
  const fireShot = useFireShot(id)

  useSubscribeToShot(id, () => {
    ref.current?.blink()
  })

  return <TriggerPad ref={ref} onMouseDown={fireShot} />
}
