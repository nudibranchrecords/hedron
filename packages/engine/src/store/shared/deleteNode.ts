import { EngineState } from '@store/types'

export const deleteNode = (state: EngineState, nodeId: string) => {
  const node = state.nodes[nodeId]
  if (node) {
    // Clear childIds from parent nodes, if applicable
    for (const parentId of node.parentIds) {
      const parentNode = state.nodes[parentId]
      if (parentNode) {
        parentNode.childIds = parentNode.childIds.filter((id) => id !== nodeId)
      }
    }

    // Delete the node and its value
    delete state.nodes[nodeId]
    delete state.nodeValues[nodeId]

    // Delete all child nodes recursively
    for (const childNodeId of node.childIds) {
      deleteNode(state, childNodeId)
    }
  }
}
