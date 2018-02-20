import tapTempoFunc from 'tap-tempo'
import { clockPulse } from '../store/clock/actions'
import { settingsUpdate } from '../store/settings/actions'

let store
let requestId
let marker
let diff

const tapTempo = tapTempoFunc()

const loop = () => {
  // Only pulse clock if is generated
  const settings = store.getState().settings
  const bpm = settings.clockBpm
  const mspp = (60 / (bpm * 24)) * 1000

  if (settings.clockGenerated) {
    // Check to see if time passed is more than time per pulse
    diff = window.performance.now() - marker

    while (diff > mspp) {
      // Pulse if so
      store.dispatch(clockPulse())
      // Increase next time to check against by time per pulse
      marker += mspp
      // Loop over in case missed more than one pulse
      diff -= mspp
    }
  } else {
    marker = window.performance.now()
  }

  requestId = requestAnimationFrame(loop)
}

export const stopGeneratedClock = () => {
  cancelAnimationFrame(requestId)
  requestId = undefined
}

export const tap = tapTempo.tap

export default (injectedStore) => {
  store = injectedStore

  tapTempo.on('tempo', (bpm) => {
    store.dispatch(settingsUpdate({ clockBpm: Math.round(bpm) }))
  })

  marker = window.performance.now()
  loop()
}
