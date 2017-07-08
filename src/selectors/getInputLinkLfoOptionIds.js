export default (state, linkId) => {
  const link = state.inputLinks[linkId]

  if (link.input && link.input.id === 'lfo') {
    if (link.type === 'shot') {
      return link.lfoOptionIds.filter(id => {
        return state.inputLinks[id].key === 'rate'
      })
    } else {
      return link.lfoOptionIds
    }
  }

  return undefined
}
