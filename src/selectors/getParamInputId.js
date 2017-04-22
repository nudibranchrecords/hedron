export default (state, paramId) => {
  const input = state.params[paramId].input

  if (!input) {
    return false
  } else if (input.type === 'midi') {
    return 'midi'
  } else {
    return input.id
  }
}
