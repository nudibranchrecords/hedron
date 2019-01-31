export default (state, linkId) => {
  const ids = state.inputLinks[linkId].audioOptionIds
  return ids
}
