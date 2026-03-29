import { useEffect, useRef } from 'react'
import { ParamVector, NodeValue } from '@hedron-gl/engine'
import { useEngineStore, useEngineStoreWithContext } from '@hooks/storeHooks'

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
        // Sometimes this can be undefined briefly if a node is deleted
        if (value === undefined) {
          return
        }
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
  const {
    childGroups: { vectorComponentIds },
  } = useEngineStore((state) => state.nodes[nodeId] as ParamVector)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribeFuncs: (() => void)[] = []

    const unsubscribe = engineStore.subscribe(
      (state) => vectorComponentIds.map((id) => state.nodeValues[id]),
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
  }, [vectorComponentIds, engineStore, nodeId])
}
