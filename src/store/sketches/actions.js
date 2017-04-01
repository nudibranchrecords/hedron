export function sketchesCreateInstance (moduleId) {
  return {
    type: 'SKETCHES_CREATE_INSTANCE',
    payload: { moduleId }
  }
}

export function sketchesParamValueUpdate (id, value) {
  return {
    type: 'SKETCHES_PARAM_VALUE_UPDATE',
    payload: { id, value }
  }
}
