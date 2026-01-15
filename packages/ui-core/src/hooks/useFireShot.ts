import { useCallback } from 'react'
import { useUpdateNodeValue } from '@hooks/useUpdateNodeValue'

/**
 * Returns a callback that, when called, updates the value of the specified shot node to the current timestamp.
 * This effectively "fires" the shot, because of listeners in the Hedron engine.
 **/
export const useFireShot = (shotId: string) => {
  const updateNodeValue = useUpdateNodeValue()

  const onValueChange = useCallback(() => {
    updateNodeValue(shotId, performance.now())
  }, [shotId, updateNodeValue])

  return onValueChange
}
