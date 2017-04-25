export default (state, nodeIds) => {
  if (nodeIds === 0) return []

  return nodeIds.map(id => {
    const node = state.nodes[id]
    if (node === undefined) {
      throw (new Error(`Missing node: ${id}`))
    }
    return node
  })
}
