export function midiStartLearning (paramId) {
  return {
    type: 'MIDI_START_LEARNING',
    payload: { paramId }
  }
}

export function midiStopLearning () {
  return {
    type: 'MIDI_STOP_LEARNING'
  }
}
