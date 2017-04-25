const defaultState = {
  learning: false
}

const midiReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'MIDI_START_LEARNING': {
      return {
        ...state,
        learning: p.nodeId
      }
    }
    case 'MIDI_STOP_LEARNING': {
      return {
        ...state,
        learning: false
      }
    }
    default:
      return state
  }
}

export default midiReducer
