const defaultState = {
  beat: 0,
  bpm: 0,
  isGenerated: false
}

const clockReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'CLOCK_BEAT_INC': {
      let beat = state.beat + 1
      if (beat > 63) beat = 0

      return {
        ...state,
        beat,
        bpm: p.bpm
      }
    }
    case 'CLOCK_RESET': {
      return {
        ...state,
        beat: 0
      }
    }
    case 'CLOCK_GENERATED_TOGGLE': {
      return {
        ...state,
        isGenerated: !state.isGenerated
      }
    }
    default:
      return state
  }
}

export default clockReducer
