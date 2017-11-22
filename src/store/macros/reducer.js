const defaultState = {
  items: {}
}
import _ from 'lodash'

const macroReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_MACRO_CREATE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            nodeId: p.nodeId,
            targetParamLinks: []
          }
        }
      }
    }
    default:
      return state
  }
}

export default macroReducer
