import getNodesValues from './getNodesValues'

export default (state, linkId) => {
  const ids = state.nodes[linkId].midiOptionIds
  const vals = getNodesValues(state, ids)

  if (vals.controlType === 'abs') {
    // Remove 'sensitivity' if controlType === abs
    // This is a bit dodgy as it assumes sensitivity
    // will always be first in the list
    return ids.slice(1)
  }
  return ids
}
