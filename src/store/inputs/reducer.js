const defaultState = {
  values: {
    audio_0: 0,
    audio_1: 0,
    audio_2: 0,
    audio_3: 0
  }
}

const inputsReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'INPUT_FIRED': {
      return {
        ...state,
        values: {
          ...state.values,
          [p.inputId]: p.value
        }
      }
    }
    default:
      return state
  }
}

export default inputsReducer
