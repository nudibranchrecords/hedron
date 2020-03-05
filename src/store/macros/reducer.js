import { union } from 'lodash'

const defaultState = {
  learningId: false,
  openedId: undefined,
  lastId: undefined,
  nodeIds: [],
}

const macroReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_MACRO_ADD': {
      return {
        ...state,
        nodeIds: union(state.nodeIds, [p.nodeId]),
      }
    }
    case 'R_MACRO_DELETE': {
      return {
        ...state,
        nodeIds: state.nodeIds.filter(item => item !== p.nodeId),
      }
    }
    case 'R_MACRO_LEARNING_TOGGLE': {
      return {
        ...state,
        learningId: state.learningId === p.id ? false : p.id,
      }
    }
    case 'R_MACRO_LEARNING_STOP': {
      return {
        ...state,
        learningId: false,
      }
    }
    case 'R_MACRO_OPEN_TOGGLE': {
      return {
        ...state,
        openedId: p.id !== state.openedId ? p.id : undefined,
      }
    }
    case 'R_MACRO_CLOSE': {
      if (!p.id || p.id === state.openedId) {
        return {
          ...state,
          openedId: undefined,
        }
      } else {
        return state
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
