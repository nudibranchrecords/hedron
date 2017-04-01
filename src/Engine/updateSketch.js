export default (sketchId, state) => {
  const sketchParams = state.sketches[sketchId].params
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.params[id]
    params[param.key] = param.value
  })

  return params
}

