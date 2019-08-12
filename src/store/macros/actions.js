export function macrosReplaceAll (macros) {
  return {
    type: 'MACROS_REPLACE_ALL',
    payload: { macros },
  }
}

export function uMacroCreate () {
  return {
    type: 'U_MACRO_CREATE',
  }
}

export function uMacroDelete (nodeId) {
  return {
    type: 'U_MACRO_DELETE',
    payload: { nodeId },
  }
}

export function rMacroAdd (nodeId) {
  return {
    type: 'R_MACRO_ADD',
    payload: { nodeId },
  }
}

export function rMacroDelete (nodeId) {
  return {
    type: 'R_MACRO_DELETE',
    payload: { nodeId },
  }
}

export function rMacroUpdateLastId (id) {
  return {
    type: 'R_MACRO_UPDATE_LAST_ID',
    payload: { id },
  }
}

export function uMacroTargetParamLinkAdd (macroId, paramId) {
  return {
    type: 'U_MACRO_TARGET_PARAM_LINK_ADD',
    payload: { macroId, paramId },
  }
}

export function rMacroOpenToggle (id) {
  return {
    type: 'R_MACRO_OPEN_TOGGLE',
    payload: { id },
  }
}

export function rMacroClose () {
  return {
    type: 'R_MACRO_CLOSE',
  }
}

export function rMacroLearningToggle (id) {
  return {
    type: 'R_MACRO_LEARNING_TOGGLE',
    payload: { id },
  }
}

export function rMacroLearningStop () {
  return {
    type: 'R_MACRO_LEARNING_STOP',
  }
}

export function uMacroTargetParamLinkDelete (macroId, paramId) {
  return {
    type: 'U_MACRO_TARGET_PARAM_LINK_DELETE',
    payload: { macroId, paramId },
  }
}

export function uMacroAddAllForSketch (id) {
  return {
    type: 'U_MACRO_ADD_ALL_FOR_SKETCH',
    payload: {
      id,
    },
  }
}

export function uMacroAddAllForScene (id) {
  return {
    type: 'U_MACRO_ADD_ALL_FOR_SCENE',
    payload: {
      id,
    },
  }
}
