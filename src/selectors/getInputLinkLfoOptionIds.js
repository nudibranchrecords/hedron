export default (state, linkId) => {
  const link = state.inputLinks[linkId]

  if (link.input && link.input.id === 'lfo') {
    if (link.nodeType === 'shot') {
      return link.lfoOptionIds.filter(id => {
        return state.nodes[id].key === 'rate'
      })
    } else {
      return link.lfoOptionIds
    }
  }

  return undefined
}
