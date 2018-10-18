export function inputFired (inputId, value, meta) {
  return {
    type: 'INPUT_FIRED',
    payload: { inputId, value, meta },
  }
}

export function inputsReplaceAll (inputs) {
  return {
    type: 'INPUTS_REPLACE_ALL',
    payload: { inputs },
  }
}

export function inputAssignedLinkCreate (inputId, linkId, deviceId) {
  return {
    type: 'INPUT_ASSIGNED_LINK_CREATE',
    payload: { inputId, linkId, deviceId },
  }
}

export function inputAssignedLinkDelete (inputId, linkId) {
  return {
    type: 'INPUT_ASSIGNED_LINK_DELETE',
    payload: { inputId, linkId },
  }
}
