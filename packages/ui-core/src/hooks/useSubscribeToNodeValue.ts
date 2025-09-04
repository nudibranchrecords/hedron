import { useEffect, useRef } from 'react'
import { NodeParamWithChildren, NodeValue } from '@hedron/engine'
import { useEngineStore, useEngineStoreWithContext } from '@hooks/useStores'

export const useSubscribeToNodeValue = <T extends NodeValue>(
  nodeId: string,
  callback: (value: T) => void,
) => {
  const engineStore = useEngineStoreWithContext()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribe = engineStore.subscribe(
      (state) => state.nodeValues[nodeId],
      (value) => {
        callbackRef.current(value as T)
      },
      {
        fireImmediately: true,
      },
    )

    return () => {
      unsubscribe()
    }
  }, [engineStore, nodeId])
}

export const useSubscribeToNodeChildrenValues = <T extends NodeValue>(
  nodeId: string,
  callback: (value: T[]) => void,
) => {
  const engineStore = useEngineStoreWithContext()
  const { childNodeIds } = useEngineStore((state) => state.nodes[nodeId] as NodeParamWithChildren)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribeFuncs: (() => void)[] = []

    const unsubscribe = engineStore.subscribe(
      (state) => childNodeIds.map((id) => state.nodeValues[id]),
      (childNodeValues) => {
        callbackRef.current(childNodeValues as T[])
      },
      {
        fireImmediately: true,
        equalityFn: (prev, next) => prev.every((value, index) => value === next[index]),
      },
    )
    unsubscribeFuncs.push(unsubscribe)

    return () => {
      unsubscribe()
    }
  }, [childNodeIds, engineStore, nodeId])
}
