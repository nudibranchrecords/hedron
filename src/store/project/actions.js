export function projectSave () {
  return {
    type: 'PROJECT_SAVE',
  }
}

export function projectLoad () {
  return {
    type: 'PROJECT_LOAD',
  }
}

export function projectSaveAs () {
  return {
    type: 'PROJECT_SAVE_AS',
  }
}

export function projectLoadRequest () {
  return {
    type: 'PROJECT_LOAD_REQUEST',
  }
}

export function projectRehydrate (data) {
  return {
    type: 'PROJECT_REHYDRATE',
    payload: {
      data,
    },
  }
}

export function projectLoadSuccess (data) {
  return {
    type: 'PROJECT_LOAD_SUCCESS',
    payload: {
      data,
    },
  }
}

export function projectFilepathUpdate (filePath) {
  return {
    type: 'PROJECT_FILEPATH_UPDATE',
    payload: {
      filePath,
    },
  }
}

export function projectChooseSketchesFolder (disableRedirect, createSceneAfter) {
  return {
    type: 'PROJECT_CHOOSE_SKETCHES_FOLDER',
    payload: {
      disableRedirect,
      createSceneAfter,
    },
  }
}

export function projectSketchesPathUpdate (path) {
  return {
    type: 'PROJECT_SKETCHES_PATH_UPDATE',
    payload: {
      path,
    },
  }
}

export function projectError (message, meta) {
  return {
    type: 'PROJECT_ERROR',
    payload: {
      message, meta,
    },
  }
}

export function projectErrorAdd (message) {
  return {
    type: 'PROJECT_ERROR_ADD',
    payload: {
      message,
    },
  }
}

export function projectErrorPopupOpen (message, code) {
  return {
    type: 'PROJECT_ERROR_POPUP_OPEN',
    payload: {
      message,
      code,
    },
  }
}

export function projectErrorPopupClose (message, type) {
  return {
    type: 'PROJECT_ERROR_POPUP_CLOSE',
  }
}
