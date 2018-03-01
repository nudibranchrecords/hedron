import getNode from './getNode'
import getInputLink from './getInputLink'
import getInputLinkIdsSeperated from './getInputLinkIdsSeperated'

export default (state, nodeId) => {
  const node = getNode(state, nodeId)
  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)
  // This assumes that "alwaysActive" is MIDI. May change in the future
  const numMidi = getInputLinkIdsSeperated(state, nodeId).alwaysActive.length
  const mainInput = activeInputLink && activeInputLink.title

  if (numMidi > 0) {
    if (mainInput) {
      return `${mainInput} +${numMidi} MIDI`
    } else {
      return `${numMidi} MIDI`
    }
  } else {
    return mainInput
  }
}
