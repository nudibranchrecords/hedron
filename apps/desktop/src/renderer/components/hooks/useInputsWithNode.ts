import { InputNode } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useShallow } from 'zustand/react/shallow'

export const useInputsWithNode = (parentId: string): InputNode[] => {
  return useEngineStore(
    useShallow((state) => {
      const parentNode = state.nodes[parentId]
      const inputIds = parentNode?.childGroups.inputNodeIds || []
      const inputs = inputIds
        .map((id) => state.nodes[id])
        .filter((node): node is InputNode => !!node)
      return inputs
    }),
  )
}
