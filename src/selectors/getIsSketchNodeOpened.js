export default (state, sketchId, nodeId, nodeType) =>
  state.sketches[sketchId].openedNodes[nodeType] === nodeId
