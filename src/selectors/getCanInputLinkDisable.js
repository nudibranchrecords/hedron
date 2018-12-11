export default (state, linkId) =>
  state.inputLinks[linkId].input.type !== 'midi' &&
  state.inputLinks[linkId].input.type !== 'anim'
