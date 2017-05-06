export default (state, nodeId) => {
  const node = state.nodes[nodeId]

  if (node.input && node.input.id === 'lfo') {
    return node.lfoOptionIds
  }

  return false
}
