export function paramCreate (id, param) {
  return {
    type: 'PARAM_CREATE',
    payload: {
      id,
      param
    }
  }
}

export function paramDelete (id) {
  return {
    type: 'PARAM_DELETE',
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
