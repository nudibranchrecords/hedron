import _ from 'lodash'

const defaultState = {}

const shotsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SHOT_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'SHOT_CREATE': {
      return {
        ...state,
        [p.id]: p.shot
      }
    }
    case 'SHOTS_REPLACE_ALL': {
      return p.shots
    }
    default:
      return state
  }
}

export default shotsReducer
