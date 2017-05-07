export function inputFired (inputId, value, type) {
  return {
    type: 'INPUT_FIRED',
    payload: { inputId, value, type }
  }
}

export function inputsReplaceAll (inputs) {
  return {
    type: 'INPUTS_REPLACE_ALL',
    payload: { inputs }
  }
}

export function inputAssignedNodeCreate (inputId, nodeId) {
  return {
    type: 'INPUT_ASSIGNED_NODE_CREATE',
    payload: { inputId, nodeId }
  }
}

export function inputAssignedNodeDelete (inputId, nodeId) {
  return {
    type: 'INPUT_ASSIGNED_NODE_DELETE',
    payload: { inputId, nodeId }
  }
}
