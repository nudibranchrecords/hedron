import getNode from './getNode'

export default (state, nodeId, panelId) => {
  switch (panelId) {
    case 'overview':
      return state.ui.openedNode === nodeId
    case 'macros':
      return state.macros.openedId === nodeId
    case 'sketch':
    default:
      const node = getNode(state, nodeId)
      return state.sketches[node.sketchId].openedNodeId === nodeId
  }
}
