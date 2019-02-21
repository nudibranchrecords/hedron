import uid from 'uid'
import { midiNotes, messageTypes } from '../midiMessage'
import { uInputLinkUpdateMidiInput } from '../../store/inputLinks/actions'

export default linkId => {
  return [
    {
      title: 'MIDI Sensitivity',
      key: 'sensitivity',
      id: uid(),
      value: 0.5,
      inputLinkIds: [],
      subNode: true,
    },
    {
      title: 'Control Type',
      key: 'controlType',
      type: 'select',
      id: uid(),
      value: 'abs',
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 'abs',
          label: 'Absolute',
        },
        {
          value: 'rel1',
          label: 'Relative 1',
        },
        {
          value: 'rel2',
          label: 'Relative 2',
        },
        {
          value: 'rel3',
          label: 'Relative 3',
        },
      ],
    },
    {
      title: 'Note',
      key: 'noteNum',
      type: 'select',
      id: uid(),
      inputLinkIds: [],
      subNode: true,
      options: midiNotes.map((label, value) => ({ value, label })),
      onChangeAction: uInputLinkUpdateMidiInput(linkId),
    },
    {
      title: 'Message Type',
      key: 'messageType',
      type: 'select',
      id: uid(),
      inputLinkIds: [],
      subNode: true,
      options: Object.keys(messageTypes).map(key => (
        {
          value: messageTypes[key].key,
          label: messageTypes[key].title,
        }
      )),
      onChangeAction: uInputLinkUpdateMidiInput(linkId),
    },
    {
      title: 'Channel',
      key: 'channel',
      type: 'select',
      id: uid(),
      inputLinkIds: [],
      subNode: true,
      options: Array(16).fill(0).map((value, index) => (
        {
          value: index,
          label: index + 1,
        }
      )),
      onChangeAction: uInputLinkUpdateMidiInput(linkId),
    },
  ]
}
