const defaultState = {
  beat: 0,
  bpm: 0,
  isGenerated: true
}

const clockReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'CLOCK_BEAT_INC': {
      let beat = state.beat + 1
      if (beat > 63) beat = 0
      // Purposefully mutating state
      state.beat = beat
      return state
    }
    case 'CLOCK_BPM_UPDATE': {
      // Purposefully mutating state
      state.bpm = p.bpm
      return state
    }
    case 'CLOCK_RESET': {
      // Purposefully mutating state
      state.beat = 0
      return state
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
