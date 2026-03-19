import { useEngineStore } from './storeHooks'

export const useInputCount = (nodeId: string): number => {
  return useEngineStore((state) => {
    const node = state.nodes[nodeId]
    if (!node) return 0
    return node.childrenIds.filter((childId) => {
      const child = state.nodes[childId]
      return child?.nodeType === 'input'
    }).length
  })
}
