export const getModule = (state, moduleId) =>
  state.availableModules[moduleId]

export const getSketchParamIds = (state, sketchId) => {
  return state.sketches[sketchId].paramIds
}

export const getSketchShotIds = (state, sketchId) => {
  return state.sketches[sketchId].shotIds
}
