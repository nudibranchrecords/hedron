const defaultState = {}

const macroTargetParamLinksReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_MACRO_TARGET_PARAM_LINK_CREATE': {
      return {
        ...state,
        [p.id]: {
          id: p.id,
          nodeId: p.nodeId,
          paramId: p.paramId,
          startValue: false
        }
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          startValue: p.value
        }
      }
    }
    default:
      return state
  }
}

export default macroTargetParamLinksReducer
