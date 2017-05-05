import { inputFired, inputAssignedNodeCreate } from '../store/inputs/actions'
import { midiStopLearning } from '../store/midi/actions'
import { rNodeInputUpdate } from '../store/nodes/actions'
import { clockPulse } from '../store/clock/actions'

export default (store) => {
  const onMessage = (message) => {
    // If has note data, treat as normal midi input
    if (message.data[1]) {
      const learningId = store.getState().midi.learning
      const id = 'midi_' + message.data[0].toString() + message.data[1].toString()
      const val = message.data[2] / 127

      if (learningId) {
        const device = message.currentTarget.name
        store.dispatch(inputAssignedNodeCreate(id, learningId))
        store.dispatch(rNodeInputUpdate(learningId, {
          id,
          type: 'midi',
          info: `${device} / ${message.data[1]}`
        }))
        store.dispatch(midiStopLearning())
      } else {
        store.dispatch(inputFired(id, val))
      }
    // If no note data, treat as clock
    } else {
      store.dispatch(clockPulse())
    }
  }

  navigator.requestMIDIAccess().then((midiAccess) => {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMessage
    })
  })
}

