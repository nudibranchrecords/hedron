const defaultState = {
  audio_0: {
    value: 0,
    assignedParamIds: []
  },
  audio_1: {
    value: 0,
    assignedParamIds: []
  },
  audio_2: {
    value: 0,
    assignedParamIds: []
  },
  audio_3: {
    value: 0,
    assignedParamIds: []
  }
}

const inputsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'INPUT_FIRED': {
      // We are mutating state on purpose here!!
      state[p.inputId].value = p.value
      return state
    }
    case 'INPUTS_REPLACE_ALL': {
      return p.inputs
    }
    case 'INPUT_ASSIGNED_PARAM_CREATE': {
      return {
        ...state,
        [p.inputId]: {
          ...state[p.inputId],
          assignedParamIds: [...state[p.inputId].assignedParamIds, p.paramId]
        }
      }
    }
    case 'INPUT_ASSIGNED_PARAM_DELETE': {
      return {
        ...state,
        [p.inputId]: {
          ...state[p.inputId],
          assignedParamIds: state[p.inputId].assignedParamIds
            .filter((id) => id !== p.paramId)
        }
      }
    }
    default:
      return state
  }
}

export default inputsReducer
