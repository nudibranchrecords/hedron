import { clockPulse } from '../store/clock/actions'

let store
let requestId
let marker
let diff

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

export default (injectedStore) => {
  store = injectedStore

  marker = window.performance.now()
  loop()
}
