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

export function inputAssignedParamAdd (inputId, paramId) {
  return {
    type: 'INPUT_ASSIGNED_PARAM_ADD',
    payload: { inputId, paramId }
  }
}
