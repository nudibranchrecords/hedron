export function sketchCreate (id, sketch) {
  return {
    type: 'SKETCH_CREATE',
    payload: { id, sketch }
  }
}

export function sketchDelete (id) {
  return {
    type: 'SKETCH_DELETE',
    payload: { id }
  }
}

export function sketchesReplaceAll (sketches) {
  return {
    type: 'SKETCHES_REPLACE_ALL',
    payload: {
      sketches
    }
  }
}

export function sketchNodeOpenedToggle (sketchId, nodeId, nodeType) {
  return {
    type: 'SKETCH_NODE_OPENED_TOGGLE',
    payload: { sketchId, nodeId, nodeType }
  }
}

export function sketchTitleUpdate (sketchId, value) {
  return {
    type: 'SKETCH_TITLE_UPDATE',
    payload: { sketchId, value }
  }
}
