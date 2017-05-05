export default (state, nodeId) => {
  const param = state.nodes[nodeId]

  if (state.midi.learning === nodeId) return 'Learning MIDI'
  if (param.input && param.input.type === 'midi') return param.input.info
}
