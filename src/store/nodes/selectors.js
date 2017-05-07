export const getNodeInputId = (state, nodeId) => {
  const input = state.nodes[nodeId].input
  return input && input.id
}

export const getDefaultModifierIds = state =>
  ['gain', 'range']
