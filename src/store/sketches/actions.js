export function sketchesInstanceCreate (moduleId) {
  return {
    type: 'SKETCHES_INSTANCE_CREATE',
    payload: { moduleId }
  }
}

export function sketchesInstanceDelete (id) {
  return {
    type: 'SKETCHES_INSTANCE_DELETE',
    payload: { id }
  }
}

export function sketchesParamValueUpdate (id, value) {
  return {
    type: 'SKETCHES_PARAM_VALUE_UPDATE',
    payload: { id, value }
  }
}

export function sketchesModulesUpdate (modules) {
  return {
    type: 'SKETCHES_MODULES_UPDATE',
    payload: { modules }
  }
}
