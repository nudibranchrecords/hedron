export const getAssignedNodes = (state, inputId) => {
  const ids = state.inputs[inputId].assignedNodeIds
  if (ids.length === 0) return []

  return ids.map(id => {
    const node = state.nodes[id]
    if (node === undefined) {
      throw (new Error(`Missing assigned node for input ${inputId}: ${id}`))
    }
    return node
  })
}
