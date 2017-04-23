export default (state, paramIds) => {
  if (paramIds === 0) return []

  return paramIds.map(id => {
    const param = state.params[id]
    if (param === undefined) {
      throw (new Error(`Missing param: ${id}`))
    }
    return param
  })
}
