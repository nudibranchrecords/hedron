import { inputFired } from '../store/inputs/actions'
import { midiStopLearning, midiUpdateDevices, midiMessage } from '../store/midi/actions'
import { uInputLinkCreate } from '../store/inputLinks/actions'
import { clockPulse } from '../store/clock/actions'
import { newData as teachMidi } from '../utils/getMidiMode'
import { processMidiData } from '../utils/midiMessage'

export default (store) => {
  const onMessage = (rawMessage) => {
    const state = store.getState()
    const m = processMidiData(rawMessage.data)

    if (m.messageType !== 'timingClock' && m.messageType !== 'noteOff') {
      store.dispatch(midiMessage(rawMessage.target.name, {
        data: rawMessage.data,
        timeStamp: rawMessage.timeStamp,
      }))

      const learning = state.midi.learning

      if (learning) {
        let controlType
        const mode = teachMidi(rawMessage.data, m.messageType)

        if (mode !== 'learning') {
          if (mode === 'ignore') {
            controlType = undefined
          } else {
            // abs, rel1, rel2, rel3
            controlType = mode
          }
          store.dispatch(uInputLinkCreate(
            learning.id,
            m.id,
            learning.type,
            {
              controlType,
              channel: m.channel,
              messageType: m.messageType,
              noteNum: m.noteNum,
            }
          ))
          store.dispatch(midiStopLearning())
        }
      } else {
        store.dispatch(inputFired(m.id, m.value, {
          noteOn: m.messageType === 'noteOn',
          type: 'midi',
        }))
      }
    // If no note data, treat as clock
    } else if (m.messageType === 'timingClock') {
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
