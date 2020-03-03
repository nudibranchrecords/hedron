const defaultState = {
  learning: false,
  devices: {},
  connectedDeviceIds: [],
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
      const devices = {}

      for (let key in p.devices) {
        devices[key] = {
          ...p.devices[key],
          settings: {
            forceChannel: {
              value: false,
              label: '-',
            },
          },
        }
      }

      return {
        ...state,
        devices: {
          ...devices,
          ...state.devices,
        },
        connectedDeviceIds: Object.keys(p.devices),
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
    case 'DEVICE_SETTINGS_UPDATE': {
      return {
        ...state,
        devices: {
          ...state.devices,
          [p.id]: {
            ...state.devices[p.id],
            settings: {
              ...state.devices[p.id].settings,
              ...p.values,
            },
          },
        },
      }
    }
    default:
      return state
  }
}

export default midiReducer
