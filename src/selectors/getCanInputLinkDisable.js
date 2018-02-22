export default (state, linkId) =>
  state.inputLinks[linkId].input.type !== 'midi'
