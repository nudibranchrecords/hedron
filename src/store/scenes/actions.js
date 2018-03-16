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
