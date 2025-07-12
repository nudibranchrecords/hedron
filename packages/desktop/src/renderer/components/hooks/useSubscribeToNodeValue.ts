import { useEffect } from 'react'
import { NodeParamWithChildren, NodeValue } from '@hedron/engine'
import { engineStore, useEngineStore } from '@renderer/engine'

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

export const useSubscribeToNodeChildrenValues = <T extends NodeValue>(
  nodeId: string,
  callback: (value: T[]) => void,
) => {
  const { childNodeIds } = useEngineStore((state) => state.nodes[nodeId] as NodeParamWithChildren)

  useEffect(() => {
    const unsubscribeFuncs: (() => void)[] = []

    childNodeIds.forEach((childNodeId) => {
      const unsubscribe = engineStore.subscribe(
        (state) => state.nodeValues[childNodeId],
        () => {
          const state = engineStore.getState()
          const childValues = childNodeIds.map((id) => state.nodeValues[id]) as T[]
          callback(childValues)
        },
        {
          fireImmediately: true,
        },
      )
      unsubscribeFuncs.push(unsubscribe)
    })

    return () => {
      unsubscribeFuncs.forEach((unsubscribe) => unsubscribe())
    }
  }, [childNodeIds, callback, nodeId])
}
