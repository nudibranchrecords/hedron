import _ from 'lodash'

const defaultState = {}

const nodesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'R_NODE_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'R_NODE_CREATE': {
      return {
        ...state,
        [p.id]: {
          id: p.id,
          value: 0,
          ...p.node
        }
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
    case 'NODE_INPUT_LINK_ADD': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: [...state[p.id].inputLinkIds, p.linkId]
        }
      }
    }
    case 'NODE_INPUT_LINK_REMOVE': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: state[p.id].inputLinkIds
            .filter((id) => id !== p.linkId)
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
