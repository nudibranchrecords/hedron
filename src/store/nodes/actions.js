export function uNodeCreate (id, node) {
  return {
    type: 'U_NODE_CREATE',
    payload: {
      id,
      node,
    },
  }
}

export function rNodeCreate (id, node) {
  return {
    type: 'R_NODE_CREATE',
    payload: {
      id,
      node,
    },
  }
}

export function uNodeDelete (nodeId) {
  return {
    type: 'U_NODE_DELETE',
    payload: {
      nodeId,
    },
  }
}

export function rNodeDelete (id) {
  return {
    type: 'R_NODE_DELETE',
    payload: {
      id,
    },
  }
}

export function uNodeInputLinkAdd (id, linkId) {
  return {
    type: 'U_NODE_INPUT_LINK_ADD',
    payload: {
      id,
      linkId,
    },
  }
}

export function rNodeInputLinkAdd (id, linkId) {
  return {
    type: 'R_NODE_INPUT_LINK_ADD',
    payload: {
      id,
      linkId,
    },
  }
}

export function nodeInputLinkRemove (id, linkId) {
  return {
    type: 'NODE_INPUT_LINK_REMOVE',
    payload: {
      id,
      linkId,
    },
  }
}

export function nodeValueUpdate (id, value, meta) {
  return {
    type: 'NODE_VALUE_UPDATE',
    payload: {
      id,
      value,
      meta,
    },
  }
}

export function nodeValuesBatchUpdate (values, meta) {
  return {
    type: 'NODE_VALUES_BATCH_UPDATE',
    payload: {
      values,
      meta,
    },
  }
}

export function nodesReplaceAll (nodes) {
  return {
    type: 'NODES_REPLACE_ALL',
    payload: {
      nodes,
    },
  }
}

export function uNodeInputUpdate (nodeId, inputId, inputType) {
  return {
    type: 'U_NODE_INPUT_UPDATE',
    payload: {
      nodeId,
      inputId,
      inputType,
    },
  }
}

export function rNodeInputUpdate (nodeId, input) {
  return {
    type: 'R_NODE_INPUT_UPDATE',
    payload: {
      nodeId,
      input,
    },
  }
}

export function rNodeConnectedMacroAdd (id, macroId) {
  return {
    type: 'R_NODE_CONNECTED_MACRO_ADD',
    payload: { id, macroId },
  }
}

export function rNodeConnectedMacroRemove (id, macroId) {
  return {
    type: 'R_NODE_CONNECTED_MACRO_REMOVE',
    payload: { id, macroId },
  }
}

export function nodeOpenToggle (id) {
  return {
    type: 'NODE_OPEN_TOGGLE',
    payload: {
      id,
    },
  }
}

export function nodeTabOpen (nodeId, linkId) {
  return {
    type: 'NODE_TAB_OPEN',
    payload: {
      nodeId, linkId,
    },
  }
}

export function nodeActiveInputLinkToggle (nodeId, linkId) {
  return {
    type: 'NODE_ACTIVE_INPUT_LINK_TOGGLE',
    payload: {
      nodeId, linkId,
    },
  }
}

export function uNodeShotFired (nodeId) {
  return {
    type: 'U_NODE_SHOT_FIRED',
    payload: {
      nodeId,
    },
  }
}

export function nodeShotFired (nodeId, sketchId, method) {
  return {
    type: 'NODE_SHOT_FIRED',
    payload: {
      nodeId, sketchId, method,
    },
  }
}

export function nodeUpdate (nodeId, obj) {
  return {
    type: 'NODE_UPDATE',
    payload: {
      nodeId,
      obj,
    },
  }
}

export function nodeResetRange (nodeId) {
  return {
    type: 'NODE_RESET_RANGE',
    payload: {
      nodeId,
    },
  }
}

export function uNodeOpenInPanel (nodeId, panelId) {
  return {
    type: 'U_NODE_OPEN_IN_PANEL',
    payload: {
      nodeId, panelId,
    },
  }
}

/* Macros */

export function rNodeMacroTargetParamLinkCreate (macroId, paramId, paramLinkId) {
  return {
    type: 'R_NODE_MACRO_TARGET_PARAM_LINK_CREATE',
    payload: { macroId, paramId, paramLinkId },
  }
}

export function rNodeMacroTargetParamLinkDelete (macroId, paramId) {
  return {
    type: 'R_NODE_MACRO_TARGET_PARAM_LINK_DELETE',
    payload: { macroId, paramId },
  }
}

export function rNodeMacroTargetParamLinkUpdateStartValue (macroId, paramId, value) {
  return {
    type: 'R_NODE_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE',
    payload: { macroId, paramId, value },
  }
}

/* input links */

export function rNodeInputLinkShotArm (linkId) {
  return {
    type: 'R_NODE_INPUT_LINK_SHOT_ARM',
    payload: {
      linkId,
    },
  }
}

export function rNodeInputLinkShotDisarm (linkId) {
  return {
    type: 'R_NODE_INPUT_LINK_SHOT_DISARM',
    payload: {
      linkId,
    },
  }
}
