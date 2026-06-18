import { Param } from '@hedron-gl/engine'
import { useShallow } from 'zustand/react/shallow'
import { useEngineStore } from '@hooks/storeHooks'

/** Returns option nodes for a given parent node ID, as a key pair object based on each option node's key property */
export const useNodeOptionNodes = (parentId: string): Record<string, Param | undefined> => {
  return useEngineStore(
    useShallow((state) => {
      const optionNodes: Record<string, Param | undefined> = {}
      const parentNode = state.nodes[parentId]
      const optionNodeIds = parentNode?.childGroups.optionNodeIds || []
      optionNodeIds.forEach((id) => {
        const node = state.nodes[id] as Param | null

        if (node?.nodeType !== 'param') {
          console.warn(`useNodeOptionNodes: node "${id}" doesn't exist or is not a param node`)
          return
        }

        optionNodes[node.key] = node
      })

      return optionNodes
    }),
  )
}
