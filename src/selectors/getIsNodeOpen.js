import getNode from './getNode'
import getNodeAncestors from './getNodeAncestors'

export default (state, nodeId, panelId) => {
  let openedNodeId

  switch (panelId) {
    case 'overview':
      openedNodeId = state.ui.openedNode
      break
    case 'macros':
      openedNodeId = state.macros.openedId
      break
    case 'sketch':
    default:
      const node = getNode(state, nodeId)
      openedNodeId = state.sketches[node.sketchId].openedNodeId
  }

  if (!openedNodeId) return false

  const ancestors = getNodeAncestors(state, openedNodeId)
  return ancestors.some(node => node.id === nodeId)
}
