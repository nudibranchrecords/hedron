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
