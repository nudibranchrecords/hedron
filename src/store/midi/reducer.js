const defaultState = {
  learning: false,
  devices: {},
}

const midiReducer = (state = defaultState, action) => {
  const p = action.payload

  switch (action.type) {
    case 'MIDI_START_LEARNING': {
      return {
        ...state,
        learning: {
          id: p.nodeId,
          type: p.type,
        },
      }
    }
    case 'MIDI_STOP_LEARNING': {
      return {
        ...state,
        learning: false,
      }
    }
    case 'MIDI_UPDATE_DEVICES': {
      return {
        ...state,
        devices: p.devices,
      }
    }
    case 'MIDI_MESSAGE': {
      return {
        ...state,
        devices: {
          ...state.devices,
          [p.id]: {
            ...state.devices[p.id],
            lastMessage: p.message,
          },
        },
      }
    }
    default:
      return state
  }
}

export default midiReducer
