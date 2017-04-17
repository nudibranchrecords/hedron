import { inputFired } from '../store/inputs/actions'

export default (store) => {
  const onMessage = (message) => {
    const id = message.data[0].toString() + message.data[1].toString()
    const val = message.data[2] / 127
    store.dispatch(inputFired('midi_' + id, val))
  }

  navigator.requestMIDIAccess().then((midiAccess) => {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMessage
    })
  })
}

