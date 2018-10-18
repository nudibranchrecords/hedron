const defaultState = {}
import _ from 'lodash'

const inputLinkReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_INPUT_LINK_CREATE': {
      return {
        ...state,
        [p.id]: p.link,
      }
    }
    case 'R_INPUT_LINK_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'INPUT_LINKS_REPLACE_ALL': {
      return p.links
    }
    case 'INPUT_LINK_SHOT_ARM': {
      return {
        ...state,
        [p.id] : {
          ...state[p.id],
          armed: true,
        },
      }
    }
    case 'INPUT_LINK_SHOT_DISARM': {
      return {
        ...state,
        [p.id] : {
          ...state[p.id],
          armed: false,
        },
      }
    }
    default:
      return state
  }
}

export default inputLinkReducer
