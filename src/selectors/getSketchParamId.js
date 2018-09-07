// Gets sketch param id by key and sketh id
export default (state, sketchId, paramKey) => {
  const sketchParams = state.sketches[sketchId].paramIds
  for (let i = 0; i < sketchParams.length; i++) {
    const id = sketchParams[i]
    const param = state.nodes[id]
    if (param.key === paramKey) {
      return id
    }
  }
  return null
}
