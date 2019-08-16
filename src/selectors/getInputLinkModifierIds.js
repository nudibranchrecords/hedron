export default (state, id) => {
  const link = state.nodes[id]

  if (!link.input) return undefined

  if (link.nodeType === 'shot') {
    if (link.input.type === 'audio') {
      return link.modifierIds.filter(id => {
        return state.nodes[id].key !== 'threshold'
      })
    } else {
      return undefined
    }
  }

  return link.modifierIds
}
