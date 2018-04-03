export function uSketchCreate (moduleId, sceneId) {
  return {
    type: 'U_SKETCH_CREATE',
    payload: { moduleId, sceneId }
  }
}

export function uSketchDelete (id, sceneId) {
  return {
    type: 'U_SKETCH_DELETE',
    payload: { id, sceneId }
  }
}

export function uSketchReimport (id) {
  return {
    type: 'U_SKETCH_REIMPORT',
    payload: { id }
  }
}

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

export function sketchUpdate (sketchId, obj) {
  return {
    type: 'SKETCH_UPDATE',
    payload: { sketchId, obj }
  }
}
