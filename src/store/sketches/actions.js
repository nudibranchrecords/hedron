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
