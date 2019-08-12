export function uSketchCreate (moduleId, sceneId) {
  return {
    type: 'U_SKETCH_CREATE',
    payload: { moduleId, sceneId },
  }
}

export function uSketchDelete (id, sceneId) {
  return {
    type: 'U_SKETCH_DELETE',
    payload: { id, sceneId },
  }
}

export function uSketchReloadFile (id) {
  return {
    type: 'U_SKETCH_RELOAD_FILE',
    payload: { id },
  }
}

export function sketchCreate (id, sketch) {
  return {
    type: 'SKETCH_CREATE',
    payload: { id, sketch },
  }
}

export function sketchDelete (id) {
  return {
    type: 'SKETCH_DELETE',
    payload: { id },
  }
}

export function sketchesReplaceAll (sketches) {
  return {
    type: 'SKETCHES_REPLACE_ALL',
    payload: {
      sketches,
    },
  }
}

export function uSketchNodeOpenedToggle (nodeId) {
  return {
    type: 'U_SKETCH_NODE_OPENED_TOGGLE',
    payload: { nodeId },
  }
}

export function rSketchNodeOpenedToggle (sketchId, nodeId) {
  return {
    type: 'R_SKETCH_NODE_OPENED_TOGGLE',
    payload: { sketchId, nodeId },
  }
}

export function sketchNodeOpenedClose (sketchId) {
  return {
    type: 'SKETCH_NODE_OPENED_CLOSE',
    payload: { sketchId },
  }
}

export function sketchUpdate (sketchId, obj) {
  return {
    type: 'SKETCH_UPDATE',
    payload: { sketchId, obj },
  }
}
