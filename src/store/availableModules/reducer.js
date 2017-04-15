const defaultState = {}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'AVAILABLE_MODULES_REPLACE_ALL': {
      return p.modules
    }
    default:
      return state
  }
}

export default sketchesReducer
