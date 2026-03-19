import { EngineState } from '@store/types'

export const deleteNode = (state: EngineState, nodeId: string) => {
  const node = state.nodes[nodeId]
  if (node) {
    // Clear childrenIds from parent node, if applicable
    if (node.parentId) {
      const parentNode = state.nodes[node.parentId]
      if (parentNode) {
        parentNode.childrenIds = parentNode.childrenIds.filter((id) => id !== nodeId)
      }
    }

    // Delete the node and its value
    delete state.nodes[nodeId]
    delete state.nodeValues[nodeId]

    // Delete all child nodes recursively
    for (const childNodeId of node.childrenIds) {
      deleteNode(state, childNodeId)
    }
  }
}
