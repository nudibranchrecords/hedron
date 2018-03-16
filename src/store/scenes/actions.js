export function uSceneCreate () {
  return {
    type: 'U_SCENE_CREATE'
  }
}

export function rSceneCreate (id, scene) {
  return {
    type: 'R_SCENE_CREATE',
    payload: { id, scene }
  }
}

export function uSceneDelete (id) {
  return {
    type: 'U_SCENE_DELETE',
    payload: {
      id
    }
  }
}

export function rSceneDelete (id) {
  return {
    type: 'R_SCENE_DELETE',
    payload: {
      id
    }
  }
}

export function sceneSketchCreate (moduleId) {
  return {
    type: 'SCENE_SKETCH_CREATE',
    payload: { moduleId }
  }
}

export function sceneSketchDelete (id) {
  return {
    type: 'SCENE_SKETCH_DELETE',
    payload: { id }
  }
}

export function sceneSketchReimport (id) {
  return {
    type: 'SCENE_SKETCH_REIMPORT',
    payload: { id }
  }
}
