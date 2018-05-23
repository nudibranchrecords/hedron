export default (state, sketchId, nodeId, nodeType, notInSketch) => {
  if (notInSketch) {
    return state.ui.openedNode === nodeId
  } else {
    return state.sketches[sketchId].openedNodes[nodeType] === nodeId
  }
}
