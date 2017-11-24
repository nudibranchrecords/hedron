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

export function rMacroLearningToggle (id) {
  return {
    type: 'R_MACRO_LEARNING_TOGGLE',
    payload: { id }
  }
}

export function rMacroTargetParamLinkCreate (macroId, paramId, nodeId) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_CREATE',
    payload: { macroId, paramId, nodeId }
  }
}

export function uMacroTargetParamLinkDelete (macroId, paramId) {
  return {
    type: 'U_MACRO_TARGET_PARAM_LINK_DELETE',
    payload: { macroId, paramId }
  }
}

export function rMacroTargetParamLinkDelete (macroId, paramId) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_DELETE',
    payload: { macroId, paramId }
  }
}

export function rMacroTargetParamLinkUpdateStartValue (macroId, paramId, value) {
  return {
    type: 'R_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE',
    payload: { macroId, paramId, value }
  }
}
