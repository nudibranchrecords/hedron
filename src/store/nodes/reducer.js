import _ from 'lodash'

const defaultState = {}

const nodesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'NODE_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'R_NODE_CREATE': {
      return {
        ...state,
        [p.id]: p.node
      }
    }
    case 'NODE_VALUE_UPDATE': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          value: p.value
        }
      }
    }
    case 'NODES_REPLACE_ALL': {
      return p.nodes
    }
    case 'R_NODE_INPUT_UPDATE': {
      return {
        ...state,
        [p.nodeId] : {
          ...state[p.nodeId],
          input: p.input
        }
      }
    }
    case 'NODE_OPEN_TOGGLE': {
      return {
        ...state,
        [p.id] : {
          ...state[p.id],
          isOpen: !state[p.id].isOpen
        }
      }
    }
    default:
      return state
  }
}

export default nodesReducer
