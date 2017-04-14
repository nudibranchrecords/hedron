const defaultState = {
  values: {
    audio_0: 0,
    audio_1: 0,
    audio_2: 0,
    audio_3: 0
  },
  assignedParamIds: {
    audio_0: ['2dydii6'],
    audio_1: [],
    audio_2: [],
    audio_3: []
  }
}

const inputsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'INPUT_FIRED': {
      // We are mutating state on purpose here!!
      state.values[p.inputId] = p.value
      return state
    }
    default:
      return state
  }
}

export default inputsReducer
