export function uParamCreate (id, param) {
  return {
    type: 'U_PARAM_CREATE',
    payload: {
      id,
      param
    }
  }
}

export function rParamCreate (id, param) {
  return {
    type: 'R_PARAM_CREATE',
    payload: {
      id,
      param
    }
  }
}

export function uParamDelete (id) {
  return {
    type: 'U_PARAM_DELETE',
    payload: {
      id
    }
  }
}

export function rParamDelete (id) {
  return {
    type: 'R_PARAM_DELETE',
    payload: {
      id
    }
  }
}

export function paramValueUpdate (id, value) {
  return {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      id,
      value
    }
  }
}

export function paramsReplaceAll (params) {
  return {
    type: 'PARAMS_REPLACE_ALL',
    payload: {
      params
    }
  }
}

export function uParamInputUpdate (paramId, inputId) {
  return {
    type: 'U_PARAM_INPUT_UPDATE',
    payload: {
      paramId,
      inputId
    }
  }
}

export function rParamInputUpdate (paramId, input) {
  return {
    type: 'R_PARAM_INPUT_UPDATE',
    payload: {
      paramId,
      input
    }
  }
}
