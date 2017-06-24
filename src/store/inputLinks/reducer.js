const defaultState = {}

const inputLinkReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_INPUT_LINK_CREATE': {
      return {
        ...state,
        [p.id]: p.link
      }
    }
    default:
      return state
  }
}

export default inputLinkReducer
