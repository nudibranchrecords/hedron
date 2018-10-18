// Return two lists of IDs:
// 1. MIDI (not affected by activate toggle)
// 2. and the rest (toggle behaviour between these)

export default (state, nodeId) => {
  const ids = state.nodes[nodeId].inputLinkIds
  const obj = {
    alwaysActive: [],
    toggledActive: [],
  }
  for (let i = 0; i < ids.length; i++) {
    const link = state.inputLinks[ids[i]]
    if (link.input.type === 'midi') {
      obj.alwaysActive.push(link.id)
    } else {
      obj.toggledActive.push(link.id)
    }
  }

  return obj
}
