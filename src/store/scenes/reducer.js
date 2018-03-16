import _ from 'lodash'


const defaultState = {
  items: {}
}

const scenesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_SCENE_CREATE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: p.scene
        }
      }
    }
    case 'R_SCENE_DELETE': {
      return {
        ...state,
        items: _.omit(state.items, [p.id])
      }
    }
    default:
      return state
  }
}

export default scenesReducer
