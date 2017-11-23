const defaultState = {
  learningId: false,
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
            targetParamLinks: {}
          }
        }
      }
    }
    case 'R_MACRO_LEARNING_TOGGLE': {
      return {
        ...state,
        learningId: state.learningId !== false ? false : p.id
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_CREATE': {
      return {
        ...state,
        items: {
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: {
              ...state.items[p.macroId].targetParamLinks,
              [p.paramId]: {
                nodeId: p.nodeId,
                paramId: p.paramId,
                startValue: false
              }
            }
          }
        }
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE': {
      return {
        ...state,
        items: {
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: {
              ...state.items[p.macroId].targetParamLinks,
              [p.paramId]: {
                ...state.items[p.macroId].targetParamLinks[p.paramId],
                startValue: p.value
              }
            }
          }
        }
      }
    }
    default:
      return state
  }
}

export default macroReducer
