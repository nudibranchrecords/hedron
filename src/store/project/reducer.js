const defaultState = {
  filePath: undefined,
  sketchesPath: undefined,
  errors: []
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
    case 'PROJECT_ERROR': {
      return {
        ...state,
        errors: [...state.errors, p.message]
      }
    }
    default:
      return state
  }
}

export default projectReducer
