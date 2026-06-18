import { useCallback, useRef } from 'react'

import { TriggerPad, TriggerPadHandle } from '@components/TriggerPad/TriggerPad'
import { useEngine } from '@hooks/engineHooks'
import { useSubscribeToShot } from '@hooks/useSubscribeToShot'

interface ShotProps {
  id: string
}

export const Shot = ({ id }: ShotProps) => {
  const ref = useRef<TriggerPadHandle>(null)
  const engine = useEngine()

  const fireShot = useCallback(() => {
    engine.fireShot(id)
  }, [engine, id])

  useSubscribeToShot(id, () => {
    ref.current?.blink()
  })

  return <TriggerPad ref={ref} onMouseDown={fireShot} />
}
