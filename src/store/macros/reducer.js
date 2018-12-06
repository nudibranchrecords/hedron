import { omit } from 'lodash'

const defaultState = {
  learningId: false,
  openedId: undefined,
  lastId: undefined,
  items: {},
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
            targetParamLinks: {},
          },
        },
      }
    }
    case 'R_MACRO_DELETE': {
      return {
        ...state,
        items: omit(state.items, [p.id]),
      }
    }
    case 'R_MACRO_LEARNING_TOGGLE': {
      return {
        ...state,
        learningId: state.learningId !== false ? false : p.id,
      }
    }
    case 'R_MACRO_LEARNING_STOP': {
      return {
        ...state,
        learningId: false,
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_CREATE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: {
              ...state.items[p.macroId].targetParamLinks,
              [p.paramId]: {
                nodeId: p.nodeId,
                paramId: p.paramId,
                startValue: false,
              },
            },
          },
        },
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_DELETE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: omit(state.items[p.macroId].targetParamLinks, [p.paramId]),
          },
        },
      }
    }
    case 'R_MACRO_TARGET_PARAM_LINK_UPDATE_START_VALUE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.macroId]: {
            ...state.items[p.macroId],
            targetParamLinks: {
              ...state.items[p.macroId].targetParamLinks,
              [p.paramId]: {
                ...state.items[p.macroId].targetParamLinks[p.paramId],
                startValue: p.value,
              },
            },
          },
        },
      }
    }
    case 'R_MACRO_OPEN_TOGGLE': {
      return {
        ...state,
        openedId: p.id !== state.openedId ? p.id : undefined,
      }
    }
    case 'R_MACRO_UPDATE_LAST_ID': {
      return {
        ...state,
        lastId: p.id,
      }
    }
    case 'MACROS_REPLACE_ALL': {
      return p.macros
    }
    default:
      return state
  }
}

export default macroReducer
