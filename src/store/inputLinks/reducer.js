const defaultState = {
  nodeIds: [],
}
import _ from 'lodash'

const inputLinkReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_INPUT_LINK_ADD': {
      return {
        ...state,
        nodeIds: _.union(state.nodeIds, [p.id]),
      }
    }
    case 'R_INPUT_LINK_DELETE': {
      return {
        ...state,
        nodeIds: state.nodeIds.filter(item => item !== p.id),
      }
    }
    case 'INPUT_LINKS_REPLACE_ALL': {
      return p.links
    }
    default:
      return state
  }
}

export default inputLinkReducer
