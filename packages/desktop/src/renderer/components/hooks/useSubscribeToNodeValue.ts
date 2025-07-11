import { useEffect } from 'react'
import { NodeValue } from '@hedron/engine'
import { engineStore } from '@renderer/engine'

export const useSubscribeToNodeValue = <T extends NodeValue>(
  nodeId: string,
  callback: (value: T) => void,
) => {
  useEffect(() => {
    const unsubscribe = engineStore.subscribe(
      (state) => state.nodeValues[nodeId],
      (value) => {
        callback(value as T)
      },
      {
        fireImmediately: true,
      },
    )

    return () => {
      unsubscribe()
    }
  }, [nodeId, callback])
}
