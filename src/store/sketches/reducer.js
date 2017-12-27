import _ from 'lodash'

const defaultState = {}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SKETCH_CREATE': {
      return {
        ...state,
        [p.id] : p.sketch
      }
    }
    case 'SKETCH_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'SKETCHES_REPLACE_ALL': {
      return p.sketches
    }
    default:
      return state
  }
}

export default sketchesReducer
