export function uMacroCreate () {
  return {
    type: 'U_MACRO_CREATE'
  }
}

export function uMacroTargetParamLinkAdd (macroId, paramId) {
  return {
    type: 'U_MACRO_TARGET_PARAM_LINK_ADD',
    payload: { macroId, paramId }
  }
}

export function rMacroTargetParamLinkAdd (macroId, linkId) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_ADD',
    payload: { macroId, linkId }
  }
}

export function rMacroCreate (id, nodeId) {
  return {
    type: 'R_MACRO_CREATE',
    payload: { id, nodeId }
  }
}
