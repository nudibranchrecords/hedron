import { EngineState } from '@store/types'

export const deleteNode = (state: EngineState, nodeId: string) => {
  const node = state.nodes[nodeId]
  if (node) {
    delete state.nodes[nodeId]
    delete state.nodeValues[nodeId]

    // Assumes node.childrenIds contains option nodes and inputs
    for (const childNodeId of node.childrenIds) {
      deleteNode(state, childNodeId)
    }
  }
}
