// Gets newest sketch param id by key
export default (state, sketchId, paramKey) => {
  const sketchParams = state.sketches[sketchId].paramIds
  for (var i = 0; i < sketchParams.length; i++) {
    var id = sketchParams[i]
    const param = state.nodes[id]
    if (param.key == paramKey) {
      return id
    }
  }
  return null
}
