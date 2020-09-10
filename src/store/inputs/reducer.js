const defaultState = {
  audio: {
    value: [0, 0, 0, 0],
    assignedLinkIds: [],
  },
  lfo: {
    value: 0,
    assignedLinkIds: [],
  },
  texture: {
    value: null,
    assignedLinkIds: [],
  },
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
    case 'INPUT_ASSIGNED_LINK_CREATE': {
      if (state[p.inputId]) {
        return {
          ...state,
          [p.inputId]: {
            ...state[p.inputId],
            assignedLinkIds: [...state[p.inputId].assignedLinkIds, p.linkId],
          },
        }
      } else {
        return {
          ...state,
          [p.inputId]: {
            assignedLinkIds: [p.linkId],
          },
        }
      }
    }
    case 'INPUT_ASSIGNED_LINK_DELETE': {
      return {
        ...state,
        [p.inputId]: {
          ...state[p.inputId],
          assignedLinkIds: state[p.inputId].assignedLinkIds
            .filter((id) => id !== p.linkId),
        },
      }
    }
    default:
      return state
  }
}

export default inputsReducer
