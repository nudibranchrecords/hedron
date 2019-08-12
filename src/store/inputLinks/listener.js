import getInputLink from '../../selectors/getInputLink'
import getNodes from '../../selectors/getNodes'
import { constructMidiId } from '../../utils/midiMessage'
import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import { nodeUpdate } from '../nodes/actions'

const handleUpdateMidiInput = (action, store) => {
  const state = store.getState()
  const link = getInputLink(state, action.payload.linkId)
  const opts = getNodes(state, link.midiOptionIds)

  let messageType, noteNum, channel

  opts.forEach(opt => {
    if (opt.key === 'messageType') messageType = opt.value
    if (opt.key === 'noteNum') noteNum = opt.value
    if (opt.key === 'channel') channel = opt.value
  })

  const newInputId = constructMidiId(messageType, noteNum, channel)

  store.dispatch(inputAssignedLinkDelete(link.input.id, link.id))
  store.dispatch(inputAssignedLinkCreate(newInputId, link.id))
  store.dispatch(nodeUpdate(link.id, { input: { id: newInputId, type: 'midi' } }))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_INPUT_LINK_UPDATE_MIDI_INPUT':
      handleUpdateMidiInput(action, store)
      break
  }
}

