const defaultState = {
  beat: 0
}

const clockReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CLOCK_BEAT_INC': {
      let beat = state.beat + 1
      if (beat > 63) beat = 0

      return {
        ...state,
        beat
      }
    }
    default:
      return state
  }
}

export default clockReducer
