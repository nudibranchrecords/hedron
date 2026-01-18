import { useEffect, useRef } from 'react'
import { useEngineStoreWithContext } from './storeHooks'

/**
 * Hook that fires a callback whenever shot is fired.
 */
export const useSubscribeToShot = (nodeId: string, callback: () => void) => {
  const engineStore = useEngineStoreWithContext()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribe = engineStore.subscribe(
      (state) => state.nodeValues[nodeId],
      () => {
        callbackRef.current()
      },
    )

    return () => {
      unsubscribe()
    }
  }, [engineStore, nodeId])
}
