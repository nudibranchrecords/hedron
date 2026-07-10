import { useEffect, useRef } from 'react'
import { ParamVector, ParamValue } from '@hedron-gl/engine'
import { useEngineStore, useEngine } from '@hooks/engineHooks'

export const useSubscribeToParamValue = <T extends ParamValue>(
  nodeId: string | undefined,
  callback: (value: T) => void,
) => {
  const engine = useEngine()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!nodeId) {
      return
    }

    const unsubscribe = engine.getStore().subscribe(
      (state) => state.paramValues[nodeId],
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
  }, [engine, nodeId])
}

export const useSubscribeToNodeChildrenValues = <T extends ParamValue>(
  nodeId: string,
  callback: (value: T[]) => void,
) => {
  const engine = useEngine()
  const {
    childGroups: { vectorComponentIds },
  } = useEngineStore((state) => state.nodes[nodeId] as ParamVector)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribeFuncs: (() => void)[] = []

    const unsubscribe = engine.getStore().subscribe(
      (state) => vectorComponentIds.map((id) => state.paramValues[id]),
      (childParamValues) => {
        callbackRef.current(childParamValues as T[])
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
  }, [vectorComponentIds, engine, nodeId])
}
