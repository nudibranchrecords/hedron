export default (state, linkId) => {
  const ids = state.nodes[linkId].animOptionIds
  return ids
}
