export default (state, linkId) => {
  const ids = state.nodes[linkId].audioOptionIds
  return ids
}
