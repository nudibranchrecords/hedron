const defaultState = {
  filePath: undefined,
  sketchesPath: undefined
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
    default:
      return state
  }
}

export default projectReducer
