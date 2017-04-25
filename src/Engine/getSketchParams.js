// Gets newest sketch params from state
export default (state, sketchId) => {
  const sketchParams = state.sketches[sketchId].paramIds
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.nodes[id]
    params[param.key] = param.value
  })

  return params
}

