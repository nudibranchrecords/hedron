const getSingle = (state, sketchId) => {
  const sketchParams = state.sketches[sketchId].paramIds
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.nodes[id]
    params[param.key] = param.value
  })

  return params
}

// Gets newest sketch params from state
export default (state, sketchId) => {
  if (sketchId) {
    return getSingle(state, sketchId)
  } else {
    const allParams = {}
    const keys = Object.keys(state.sketches)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const id = state.sketches[key].moduleId
      allParams[id] = getSingle(state, key)
    }

    return allParams
  }
}
