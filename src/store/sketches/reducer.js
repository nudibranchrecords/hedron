import _ from 'lodash'

const defaultState = {}

const sketchesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'SKETCH_CREATE': {
      return {
        ...state,
        [p.id]: p.sketch,
      }
    }
    case 'SKETCH_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'SKETCHES_REPLACE_ALL': {
      return p.sketches
    }
    case 'SKETCH_NODE_OPENED_TOGGLE': {
      return {
        ...state,
        [p.sketchId]: {
          ...state[p.sketchId],
          openedNodes: {
            ...state[p.sketchId].openedNodes,
            [p.nodeType]: p.nodeId !== state[p.sketchId].openedNodes[p.nodeType] ? p.nodeId : undefined,
          },
        },
      }
    }
    case 'SKETCH_UPDATE': {
      return {
        ...state,
        [p.sketchId]: {
          ...state[p.sketchId],
          ...p.obj,
        },
      }
    }
    default:
      return state
  }
}

export default sketchesReducer
