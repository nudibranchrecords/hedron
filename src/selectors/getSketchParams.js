const lerp = (v0, v1, t) => {
  return (1 - t) * v0 + t * v1
}

const getSingle = (state, sketchId) => {
  const sketchParams = state.sketches[sketchId].paramIds
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.nodes[id]
    if (param.min !== undefined && param.max !== undefined) {
      params[param.key] = lerp(param.min, param.max, param.value)
    } else {
      params[param.key] = param.value
    }
  })

  return params
}

const getAll = (state, sketches) => {
  const allParams = {}
  const keys = Object.keys(sketches)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const id = sketches[key].moduleId
    allParams[id] = getSingle(state, key)
  }

  return allParams
}

// Gets newest sketch params from state
export default (state, sketchId, sceneId) => {
  if (sketchId) {
    return getSingle(state, sketchId)
  } else if (sceneId) {
    const sceneSketches = {}
    const sketchIds = state.scenes.items[sceneId].sketchIds
    sketchIds.forEach(id => {
      sceneSketches[id] = state.sketches[id]
    })

    return getAll(state, sceneSketches)
  } else {
    return getAll(state, state.sketches)
  }
}
