import { inputFired, inputAssignedParamCreate } from '../store/inputs/actions'
import { midiStopLearning } from '../store/midi/actions'
import { rParamInputUpdate } from '../store/params/actions'

export default (store) => {
  const onMessage = (message) => {
    const learningId = store.getState().midi.learning
    const id = 'midi_' + message.data[0].toString() + message.data[1].toString()
    const val = message.data[2] / 127

    if (learningId) {
      store.dispatch(inputAssignedParamCreate(id, learningId))
      store.dispatch(rParamInputUpdate(learningId, id))
      store.dispatch(midiStopLearning())
    } else {
      store.dispatch(inputFired(id, val))
    }
  }

  navigator.requestMIDIAccess().then((midiAccess) => {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMessage
    })
  })
}

