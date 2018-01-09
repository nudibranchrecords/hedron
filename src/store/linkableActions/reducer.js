const defaultState = {}

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
    case 'LINKABLE_ACTION_INPUT_LINK_ADD': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: [...state[p.id].inputLinkIds, p.linkId]
        }
      }
    }
    default:
      return state
  }
}

export default linkableActionsReducer
