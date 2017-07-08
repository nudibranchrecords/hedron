const defaultState = {}
import _ from 'lodash'

const inputLinkReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_INPUT_LINK_CREATE': {
      return {
        ...state,
        [p.id]: p.link
      }
    }
    case 'R_INPUT_LINK_DELETE': {
      return _.omit(state, [p.id])
    }
    default:
      return state
  }
}

export default inputLinkReducer
