export default (state, nodeId) => {
  const node = state.nodes[nodeId]

  if (!node.input) return undefined

  return node.modifierIds.filter(id => {
    const modType = state.nodes[id].type
    return !modType || modType === node.input.type
  })
}
