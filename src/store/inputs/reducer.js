const defaultState = {
  audio_0: {
    value: 0,
    assignedNodeIds: []
  },
  audio_1: {
    value: 0,
    assignedNodeIds: []
  },
  audio_2: {
    value: 0,
    assignedNodeIds: []
  },
  audio_3: {
    value: 0,
    assignedNodeIds: []
  },
  lfo: {
    value: 0,
    assignedNodeIds: []
  }
}

const inputsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'INPUT_FIRED': {
      // We are mutating state on purpose here!!
      if (state[p.inputId]) {
        state[p.inputId].value = p.value
      }
      return state
    }
    case 'INPUTS_REPLACE_ALL': {
      return p.inputs
    }
    case 'INPUT_ASSIGNED_NODE_CREATE': {
      if (state[p.inputId]) {
        return {
          ...state,
          [p.inputId]: {
            ...state[p.inputId],
            assignedNodeIds: [...state[p.inputId].assignedNodeIds, p.nodeId]
          }
        }
      } else {
        return {
          ...state,
          [p.inputId]: {
            assignedNodeIds: [p.nodeId]
          }
        }
      }
    }
    case 'INPUT_ASSIGNED_NODE_DELETE': {
      return {
        ...state,
        [p.inputId]: {
          ...state[p.inputId],
          assignedNodeIds: state[p.inputId].assignedNodeIds
            .filter((id) => id !== p.nodeId)
        }
      }
    }
    default:
      return state
  }
}

export default inputsReducer
