export default (state, linkIds) => {
  const links = state.macroTargetParamLinks
  return linkIds.map(id => links[id])
}
