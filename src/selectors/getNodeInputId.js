export default (state, nodeId) => {
  const input = state.nodes[nodeId].input

  if (!input) {
    return false
  } else if (input.type === 'midi') {
    return 'midi'
  } else {
    return input.id
  }
}
