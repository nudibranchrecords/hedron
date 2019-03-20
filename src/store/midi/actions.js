export function midiStartLearning (nodeId, type) {
  return {
    type: 'MIDI_START_LEARNING',
    payload: { nodeId, type },
  }
}

export function midiStopLearning () {
  return {
    type: 'MIDI_STOP_LEARNING',
  }
}

export function midiUpdateDevices (devices) {
  return {
    type: 'MIDI_UPDATE_DEVICES',
    payload: {
      devices,
    },
  }
}

export function midiMessage (id, message) {
  return {
    type: 'MIDI_MESSAGE',
    payload: {
      id,
      message,
    },
    meta: {
      debounce: {
        time: 100,
      },
    },
  }
}
