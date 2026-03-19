import { Input, nodesAsArray } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useShallow } from 'zustand/react/shallow'

export const useInputsWithNode = (nodeId: string): Input[] => {
  return useEngineStore(
    useShallow(
      (state) =>
        nodesAsArray(state.nodes).filter(
          (node) => node.nodeType === 'input' && node.targetNodeId === nodeId,
        ) as Input[],
    ),
  )
}
