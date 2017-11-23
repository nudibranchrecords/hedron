export function rMacroTargetParamLinkCreate (id, nodeId, paramId) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_CREATE',
    payload: {
      id,
      nodeId,
      paramId
    }
  }
}

export function rMacroTargetParamLinkUpdateStartValue (id, value) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE',
    payload: {
      id,
      value
    }
  }
}
