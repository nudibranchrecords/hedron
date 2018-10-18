import _ from 'lodash'

const defaultState = {}

const nodesReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'NODE_VALUE_UPDATE': {
      if (!state[p.id]) {
        return state
      }

      if (p.meta && p.meta.dontMutate) {
        return {
          ...state,
          [p.id]: {
            ...state[p.id],
            value: p.value,
          },
        }
      } else {
        // Intentionally mutating state as these values are updating
        // VERY often. Mutating alleviates garbage collection issues
        state[p.id].value = p.value
      }

      return state
    }
    case 'NODE_VALUES_BATCH_UPDATE': {
      for (let i = 0; i < p.values.length; i++) {
        const node = p.values[i]
        state[node.id].value = node.value
      }
      return state
    }
    case 'R_NODE_DELETE': {
      return _.omit(state, [p.id])
    }
    case 'R_NODE_CREATE': {
      return {
        ...state,
        [p.id]: {
          id: p.id,
          value: 0,
          inputLinkIds: [],
          shotCount: 0,
          connectedMacroIds: [],
          ...p.node,
        },
      }
    }
    case 'R_NODE_INPUT_LINK_ADD': {
      if (!state[p.id]) {
        return state
      }
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: [...state[p.id].inputLinkIds, p.linkId],
        },
      }
    }
    case 'NODE_INPUT_LINK_REMOVE': {
      if (!state[p.id]) {
        return state
      }
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          inputLinkIds: state[p.id].inputLinkIds
            .filter((id) => id !== p.linkId),
        },
      }
    }
    case 'R_NODE_CONNECTED_MACRO_ADD': {
      if (!state[p.id]) {
        return state
      }

      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          connectedMacroIds: [...state[p.id].connectedMacroIds, p.macroId],
        },
      }
    }
    case 'R_NODE_CONNECTED_MACRO_REMOVE': {
      if (!state[p.id]) {
        return state
      }

      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          connectedMacroIds: state[p.id].connectedMacroIds
            .filter((id) => id !== p.macroId),
        },
      }
    }
    case 'NODES_REPLACE_ALL': {
      return p.nodes
    }
    case 'R_NODE_INPUT_UPDATE': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          input: p.input,
        },
      }
    }
    case 'NODE_OPEN_TOGGLE': {
      return {
        ...state,
        [p.id]: {
          ...state[p.id],
          isOpen: !state[p.id].isOpen,
        },
      }
    }
    case 'NODE_TAB_OPEN': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          openedLinkId: p.linkId,
        },
      }
    }
    case 'NODE_ACTIVE_INPUT_LINK_TOGGLE': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          activeInputLinkId: p.linkId !== state[p.nodeId].activeInputLinkId ? p.linkId : undefined,
        },
      }
    }
    case 'NODE_SHOT_FIRED': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          shotCount: state[p.nodeId].shotCount + 1,
        },
      }
    }
    case 'NODE_UPDATE': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          ...p.obj,
        },
      }
    }
    case 'NODE_RESET_RANGE': {
      return {
        ...state,
        [p.nodeId]: {
          ...state[p.nodeId],
          min: state[p.nodeId].defaultMin,
          max: state[p.nodeId].defaultMax,
        },
      }
    }
    default:
      return state
  }
}

export default nodesReducer
