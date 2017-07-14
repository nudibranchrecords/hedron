import { inputFired } from '../store/inputs/actions'
import { midiStopLearning, midiUpdateDevices, midiMessage } from '../store/midi/actions'
import { uInputLinkCreate } from '../store/inputLinks/actions'
import { clockPulse } from '../store/clock/actions'

export default (store) => {
  const onMessage = (message) => {
    const state = store.getState()
    store.dispatch(midiMessage(message.target.id, {
      data: message.data,
      timeStamp: message.timeStamp
    }))
    // If has note data, treat as normal midi input
    if (message.data[1] !== undefined) {
      const learningId = state.midi.learning
      const id = 'midi_' + message.data[0].toString() + message.data[1].toString()
      const val = message.data[2] / 127
      const noteOn = message.data[0] === 144

      if (learningId) {
        store.dispatch(uInputLinkCreate(learningId, id, 'midi', message.target.id))
        store.dispatch(midiStopLearning())
      } else {
        store.dispatch(inputFired(id, val, {
          noteOn,
          type: 'midi'
        }))
      }
    // If no note data, treat as clock
    } else {
      // Only dispatch clock pulse if no generated clock
      if (!state.clock.isGenerated) {
        store.dispatch(clockPulse())
      }
    }
  }

  navigator.requestMIDIAccess().then((midiAccess) => {
    const devices = {}
    midiAccess.inputs.forEach((entry) => {
      devices[entry.id] = {
        title: entry.name,
        id: entry.id,
        manufacturer: entry.manufacturer,
        bankIndex: 0
      }
      entry.onmidimessage = onMessage
    })
    store.dispatch(midiUpdateDevices(devices))
  })
}
