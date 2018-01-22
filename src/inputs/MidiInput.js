import { inputFired } from '../store/inputs/actions'
import { midiStopLearning, midiUpdateDevices, midiMessage } from '../store/midi/actions'
import { uInputLinkCreate } from '../store/inputLinks/actions'
import { clockPulse } from '../store/clock/actions'
import processMidiMessage from '../utils/processMidiMessage'
import now from 'performance-now'

export default (store) => {
  // Actual PPQN is 24, we're multiplying the number of pulses
  // to 48 by firing an extra pulse inbetween every real pulse
  const targetPPQN = 48
  let fakeTickEnabled = false
  let lastPulseTime = now()

  const calcMSPerPulse = (bpm) => 60000 / bpm / targetPPQN

  const onMessage = (rawMessage) => {
    const state = store.getState()
    const m = processMidiMessage(rawMessage)

    if (m.type !== 'timingClock') {
      store.dispatch(midiMessage(rawMessage.target.name, {
        data: rawMessage.data,
        timeStamp: rawMessage.timeStamp
      }))

      const learning = state.midi.learning

      if (learning) {
        store.dispatch(uInputLinkCreate(learning.id, m.id, learning.type, rawMessage.target.name))
        store.dispatch(midiStopLearning())
      } else {
        store.dispatch(inputFired(m.id, m.value, {
          noteOn: m.type === 'noteOn',
          type: 'midi'
        }))
      }
    // If no note data, treat as clock
    } else if (m.type === 'timingClock') {
      // Only dispatch clock pulse if no generated clock
      if (!state.clock.isGenerated) {
        store.dispatch(clockPulse())
        // Real pulse has happened, set vars for fake pulse to occur
        fakeTickEnabled = true
        lastPulseTime = now()
      }
    }
  }

  // Constantly check the time to see if enough has passed for
  // fake pulse to fire
  const loop = () => {
    const state = store.getState()
    const time = now()
    if (!state.clock.isGenerated && fakeTickEnabled) {
      const mspp = calcMSPerPulse(state.clock.bpm)
      if (time > lastPulseTime + mspp) {
        // Dispatch clockpulse with "bpmCalcIgnore" set to true
        store.dispatch(clockPulse(null, true))
        // Once fired, disable fake pulse from firing again until
        // real pulse has fired
        fakeTickEnabled = false
      }
    }
    requestAnimationFrame(loop)
  }

  loop()

  navigator.requestMIDIAccess().then((midiAccess) => {
    const devices = {}
    midiAccess.inputs.forEach((entry) => {
      devices[entry.name] = {
        title: entry.name,
        id: entry.name,
        manufacturer: entry.manufacturer,
        bankIndex: 0
      }
      entry.onmidimessage = onMessage
    })
    store.dispatch(midiUpdateDevices(devices))
  })
}
