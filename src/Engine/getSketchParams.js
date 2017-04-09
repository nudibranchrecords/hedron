// Gets newest sketch params from state
export default (sketchId, state) => {
  const sketchParams = state.sketches.instances[sketchId].paramIds
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.sketches.params[id]
    params[param.key] = param.value
  })

  return params
}

