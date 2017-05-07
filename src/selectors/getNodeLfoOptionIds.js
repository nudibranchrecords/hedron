export default (state, nodeId) => {
  const node = state.nodes[nodeId]

  if (node.input && node.input.id === 'lfo') {
    if (node.type === 'shot') {
      return node.lfoOptionIds.filter(id => {
        return state.nodes[id].key === 'rate'
      })
    } else {
      return node.lfoOptionIds
    }
  }

  return undefined
}
