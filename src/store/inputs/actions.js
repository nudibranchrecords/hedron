export function inputFired (inputId, value) {
  return {
    type: 'INPUT_FIRED',
    payload: { inputId, value }
  }
}

export function inputsReplaceAll (inputs) {
  return {
    type: 'INPUTS_REPLACE_ALL',
    payload: { inputs }
  }
}

export function inputAssignedParamCreate (inputId, paramId) {
  return {
    type: 'INPUT_ASSIGNED_PARAM_CREATE',
    payload: { inputId, paramId }
  }
}

export function inputAssignedParamDelete (inputId, paramId) {
  return {
    type: 'INPUT_ASSIGNED_PARAM_DELETE',
    payload: { inputId, paramId }
  }
}
