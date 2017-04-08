const defaultState = {
  filePath: undefined
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
    default:
      return state
  }
}

export default projectReducer
