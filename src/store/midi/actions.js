export function midiStartLearning (nodeId) {
  return {
    type: 'MIDI_START_LEARNING',
    payload: { nodeId }
  }
}

export function midiStopLearning () {
  return {
    type: 'MIDI_STOP_LEARNING'
  }
}

export function midiUpdateDevices (devices) {
  return {
    type: 'MIDI_UPDATE_DEVICES',
    payload: {
      devices
    }
  }
}

export function midiMessage (id, message) {
  return {
    type: 'MIDI_MESSAGE',
    payload: {
      id,
      message
    }
  }
}

export function midiDeviceBankChange (id, index) {
  return {
    type: 'MIDI_DEVICE_BANK_CHANGE',
    payload: {
      id, index
    }
  }
}
