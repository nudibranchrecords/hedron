export default (state, linkId) =>
  state.nodes[linkId].input.type !== 'midi' &&
  state.nodes[linkId].input.type !== 'anim'
