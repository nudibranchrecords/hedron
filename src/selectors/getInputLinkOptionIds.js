import getInputLinkMidiOptionIds from './getInputLinkMidiOptionIds'
import getInputLinkLfoOptionIds from './getInputLinkLfoOptionIds'

export default (state, linkId) => {
  const node = state.nodes[linkId]
  switch (node.input.type) {
    case 'midi':
      return getInputLinkMidiOptionIds(state, linkId)
    case 'lfo':
      return getInputLinkLfoOptionIds(state, linkId)
    default:
      return node.optionIds
  }
}
