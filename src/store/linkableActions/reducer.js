const defaultState = {}
import _ from 'lodash'

const linkableActionsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'LINKABLE_ACTION_CREATE': {
      return {
        ...state,
        [p.id]: {
          id: p.id,
          action: p.action,
          inputLinkIds: []
        }
      }
    }
    case 'R_LINKABLE_ACTION_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'LINKABLE_ACTION_INPUT_LINK_ADD': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: [...state[p.id].inputLinkIds, p.linkId]
        }
      }
    }
    case 'LINKABLE_ACTION_INPUT_LINK_REMOVE': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: state[p.id].inputLinkIds
            .filter((id) => id !== p.linkId)
        }
      }
    }
    default:
      return state
  }
}

export default linkableActionsReducer
