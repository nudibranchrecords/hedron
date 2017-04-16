export function shotCreate (id, shot) {
  return {
    type: 'SHOT_CREATE',
    payload: {
      id,
      shot
    }
  }
}

export function shotDelete (id) {
  return {
    type: 'SHOT_DELETE',
    payload: {
      id
    }
  }
}

export function shotFired (sketchId, method) {
  return {
    type: 'SHOT_FIRED',
    payload: {
      sketchId,
      method
    }
  }
}

export function shotsReplaceAll (shots) {
  return {
    type: 'SHOTS_REPLACE_ALL',
    payload: {
      shots
    }
  }
}
