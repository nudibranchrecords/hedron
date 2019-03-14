export default (state, nodeId) => {
  const param = state.nodes[nodeId]
  const linkIds = param.inputLinkIds

  if (state.midi.learning === nodeId) return 'Learning MIDI'
  if (linkIds) {
    let info = ''

    for (let i = 0; i < linkIds.length; i++) {
      info += state.nodes[linkIds[i]].title
      if (i !== linkIds.length - 1) info += ', '
    }
    return info
  }
}
