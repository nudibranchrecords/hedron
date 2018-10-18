import { inputFired } from '../store/inputs/actions'
import { midiStopLearning, midiUpdateDevices, midiMessage } from '../store/midi/actions'
import { uInputLinkCreate } from '../store/inputLinks/actions'
import { clockPulse } from '../store/clock/actions'
import { newData as teachMidi } from '../utils/getMidiMode'
import processMidiMessage from '../utils/processMidiMessage'

export default (store) => {
  const onMessage = (rawMessage) => {
    const state = store.getState()
    const m = processMidiMessage(rawMessage)

    if (m.type !== 'timingClock' && m.type !== 'noteOff') {
      store.dispatch(midiMessage(rawMessage.target.name, {
        data: rawMessage.data,
        timeStamp: rawMessage.timeStamp,
      }))

      const learning = state.midi.learning

      if (learning) {
        let controlType
        const mode = teachMidi(rawMessage.data, m.type)

        if (mode !== 'learning') {
          if (mode === 'ignore') {
            controlType = undefined
          } else {
            // abs, rel1, rel2, rel3
            controlType = mode
          }
          store.dispatch(uInputLinkCreate(
            learning.id, m.id, learning.type, rawMessage.target.name, controlType
          ))
          store.dispatch(midiStopLearning())
        }
      } else {
        store.dispatch(inputFired(m.id, m.value, {
          noteOn: m.type === 'noteOn',
          type: 'midi',
        }))
      }
    // If no note data, treat as clock
    } else if (m.type === 'timingClock') {
      // Only dispatch clock pulse if no generated clock
      if (!state.clock.isGenerated) {
        store.dispatch(clockPulse())
      }
    }
  }

  const processDevices = ports => {
    const devices = {}

    ports.forEach((entry) => {
      devices[entry.name] = {
        title: entry.name,
        id: entry.name,
        manufacturer: entry.manufacturer,
        bankIndex: 0,
      }
      entry.onmidimessage = onMessage
    })

    store.dispatch(midiUpdateDevices(devices))
  }

  navigator.requestMIDIAccess().then((midiAccess) => {
    processDevices(midiAccess.inputs)

    midiAccess.onstatechange = () => {
      processDevices(midiAccess.inputs)
    }
  })
}
