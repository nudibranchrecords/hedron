export default (state, nodeId) => {
  const node = state.nodes[nodeId]

  if (!node.input) return undefined

  if (node.type === 'shot') {
    if (node.input.type === 'audio') {
      return node.modifierIds.filter(id => {
        return state.nodes[id].key === 'gain'
      })
    } else {
      return undefined
    }
  }

  return node.modifierIds.filter(id => {
    const modType = state.nodes[id].type
    return !modType || modType === node.input.type
  })
}
