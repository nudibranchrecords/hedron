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
    case 'R_SCENE_SKETCH_ADD': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            sketchIds: _.union(state.items[p.id].sketchIds, [p.sketchId])
          }
        }
      }
    }
    case 'R_SCENE_SKETCH_REMOVE': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            sketchIds: state.items[p.id].sketchIds.filter(item => item !== p.sketchId)
          }
        }
      }
    }
    case 'SCENE_RENAME': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            title: p.title
          }
        }
      }
    }
    case 'SCENE_SKETCH_SELECT': {
      return {
        ...state,
        items: {
          ...state.items,
          [p.id]: {
            ...state.items[p.id],
            selectedSketchId: p.sketchId
          }
        }
      }
    }
    default:
      return state
  }
}

export default scenesReducer
