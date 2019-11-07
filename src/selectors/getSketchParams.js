import { getType } from '../valueTypes'

const getSingle = (state, sketchId) => {
  const sketchParams = state.sketches[sketchId].paramIds
  const params = {}

  sketchParams.forEach((id) => {
    const param = state.nodes[id]
    const type = getType(param.valueType)
    params[param.key] = type.getTransformedValue(param)
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
