import { EngineState } from '@store/types'

export const deleteNode = (state: EngineState, nodeId: string) => {
  const node = state.nodes[nodeId]
  if (node) {
    // Clear childIds from parent nodes, if applicable
    for (const parentId of node.parentIds) {
      const parentNode = state.nodes[parentId]
      if (parentNode) {
        for (const groupKey in parentNode.childGroups) {
          parentNode.childGroups[groupKey] = parentNode.childGroups[groupKey].filter(
            (id) => id !== nodeId,
          )
        }
      }
    }

    // Delete the node and its value
    delete state.nodes[nodeId]
    delete state.paramValues[nodeId]

    // Delete all child nodes recursively
    for (const groupKey in node.childGroups) {
      for (const childNodeId of node.childGroups[groupKey]) {
        deleteNode(state, childNodeId)
      }
    }
  }
}
