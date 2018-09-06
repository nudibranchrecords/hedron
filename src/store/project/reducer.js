const defaultState = {
  filePath: undefined,
  sketchesPath: undefined,
  errors: [],
  errorPopup: false
}

const projectReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'PROJECT_FILEPATH_UPDATE': {
      return {
        ...state,
        filePath: p.filePath
      }
    }
    case 'PROJECT_SKETCHES_PATH_UPDATE': {
      return {
        ...state,
        sketchesPath: p.path
      }
    }
    case 'PROJECT_ERROR_ADD': {
      return {
        ...state,
        errors: [...state.errors, p.message]
      }
    }
    case 'PROJECT_ERROR_POPUP_OPEN': {
      return {
        ...state,
        errorPopup: {
          message: p.message,
          code: p.code
        }
      }
    }
    case 'PROJECT_ERROR_POPUP_CLOSE': {
      return {
        ...state,
        errorPopup: false
      }
    }
    default:
      return state
  }
}

export default projectReducer
