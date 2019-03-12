export default (state, sketchId, nodeId, showIn) => {
  switch (showIn) {
    case 'overview':
      return state.ui.openedNode === nodeId
    case 'sketch':
    default:
      return state.sketches[sketchId].openedNodeId === nodeId
  }
}
