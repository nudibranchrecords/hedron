import { useEffect, useRef } from 'react'
import { useEngine } from './engineHooks'

/**
 * Hook that fires a callback whenever shot is fired.
 */
export const useSubscribeToShot = (shotId: string, callback: () => void) => {
  const engine = useEngine()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribe = engine.registerShotListener(shotId, () => {
      callbackRef.current()
    })

    return () => {
      unsubscribe()
    }
  }, [engine, shotId])
}
