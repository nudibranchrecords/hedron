export function rSceneSelectCurrent (id) {
  return {
    type: 'R_SCENE_SELECT_CURRENT',
    payload: { id },
  }
}

export function rSceneSelectChannel (id, channel) {
  return {
    type: 'R_SCENE_SELECT_CHANNEL',
    payload: { id, channel },
  }
}

export function sceneClearChannel (id) {
  return {
    type: 'SCENE_CLEAR_CHANNEL',
    payload: { id },
  }
}

export function uSceneCreate () {
  return {
    type: 'U_SCENE_CREATE',
  }
}

export function uSceneSelectChannel (id, type) {
  return {
    type: 'U_SCENE_SELECT_CHANNEL',
    payload: { id, type },
  }
}

export function rSceneCreate (id, scene) {
  return {
    type: 'R_SCENE_CREATE',
    payload: { id, scene },
  }
}

export function sceneRename (id, title) {
  return {
    type: 'SCENE_RENAME',
    payload: { id, title },
  }
}

export function uSceneDelete (id) {
  return {
    type: 'U_SCENE_DELETE',
    payload: {
      id,
    },
  }
}

export function rSceneDelete (id) {
  return {
    type: 'R_SCENE_DELETE',
    payload: {
      id,
    },
  }
}

export function sceneSketchSelect (id, sketchId) {
  return {
    type: 'SCENE_SKETCH_SELECT',
    payload: {
      id, sketchId,
    },
  }
}

export function rSceneSketchAdd (id, sketchId) {
  return {
    type: 'R_SCENE_SKETCH_ADD',
    payload: {
      id, sketchId,
    },
  }
}

export function rSceneSketchRemove (id, sketchId) {
  return {
    type: 'R_SCENE_SKETCH_REMOVE',
    payload: {
      id, sketchId,
    },
  }
}
