import _ from 'lodash'

const defaultState = {}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'PARAM_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'PARAM_CREATE': {
      return {
        ...state,
        [p.id]: p.param
      }
    }
    case 'PARAM_VALUE_UPDATE': {
      // Intentionally mutating state
      state[p.id].value = p.value
      return state
    }
    case 'PARAMS_REPLACE_ALL': {
      return p.params
    }
    default:
      return state
  }
}

export default sketchesReducer
