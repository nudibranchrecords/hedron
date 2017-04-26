export default (state, nodeIds) => {
  if (nodeIds.length === 0) return {}

  const obj = {}

  nodeIds.forEach(id => {
    const node = state.nodes[id]
    if (node === undefined) {
      throw (new Error(`Missing node: ${id}`))
    }

    obj[node.key] = node.value
  })

  return obj
}
