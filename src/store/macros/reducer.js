const defaultState = {
  items: {}
}

const macroReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_MACRO_CREATE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            id: p.id,
            nodeId: p.nodeId,
            targetParamLinks: []
          }
        }
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_ADD': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: [
              ...state.items[p.macroId].targetParamLinks,
              p.linkId
            ]
          }
        }
      }
    }
    default:
      return state
  }
}

export default macroReducer
