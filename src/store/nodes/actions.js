export function uNodeCreate (id, node) {
  return {
    type: 'U_NODE_CREATE',
    payload: {
      id,
      node
    }
  }
}

export function rNodeCreate (id, node) {
  return {
    type: 'R_NODE_CREATE',
    payload: {
      id,
      node
    }
  }
}

export function uNodeDelete (nodeId) {
  return {
    type: 'U_NODE_DELETE',
    payload: {
      nodeId
    }
  }
}

export function rNodeDelete (id) {
  return {
    type: 'R_NODE_DELETE',
    payload: {
      id
    }
  }
}

export function nodeInputLinkAdd (id, linkId) {
  return {
    type: 'NODE_INPUT_LINK_ADD',
    payload: {
      id,
      linkId
    }
  }
}

export function nodeValueUpdate (id, value) {
  return {
    type: 'NODE_VALUE_UPDATE',
    payload: {
      id,
      value
    }
  }
}

export function nodesReplaceAll (nodes) {
  return {
    type: 'NODES_REPLACE_ALL',
    payload: {
      nodes
    }
  }
}

export function uNodeInputUpdate (nodeId, inputId, inputType) {
  return {
    type: 'U_NODE_INPUT_UPDATE',
    payload: {
      nodeId,
      inputId,
      inputType
    }
  }
}

export function rNodeInputUpdate (nodeId, input) {
  return {
    type: 'R_NODE_INPUT_UPDATE',
    payload: {
      nodeId,
      input
    }
  }
}

export function nodeOpenToggle (id) {
  return {
    type: 'NODE_OPEN_TOGGLE',
    payload: {
      id
    }
  }
}

export function nodeShotFired (sketchId, method) {
  return {
    type: 'NODE_SHOT_FIRED',
    payload: {
      sketchId, method
    }
  }
}

export function nodeShotArm (nodeId) {
  return {
    type: 'NODE_SHOT_ARM',
    payload: {
      nodeId
    }
  }
}

export function nodeShotDisarm (nodeId) {
  return {
    type: 'NODE_SHOT_DISARM',
    payload: {
      nodeId
    }
  }
}
