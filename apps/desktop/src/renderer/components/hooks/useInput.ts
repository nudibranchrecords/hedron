import { Input } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useShallow } from 'zustand/react/shallow'

export const useInput = (id: string) => {
  return useEngineStore((state) => state.nodes[id])
}

export const useInputsWithNode = (nodeId: string): Input[] => {
  return useEngineStore(
    useShallow(
      (state) =>
        Object.values(state.nodes).filter(
          (node) => node.nodeType === 'input' && node.targetNodeId === nodeId,
        ) as Input[],
    ),
  )
}
