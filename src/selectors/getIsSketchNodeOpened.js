export default (state, sketchId, nodeId, notInSketch) => {
  if (notInSketch) {
    return state.ui.openedNode === nodeId
  } else {
    return state.sketches[sketchId].openedNodeId === nodeId
  }
}
