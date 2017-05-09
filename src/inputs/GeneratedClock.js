import { clockPulse } from '../store/clock/actions'

let store
let requestId
let marker
let bpm = 120
let mspp = (60 / (bpm * 24)) * 1000

const loop = () => {
  // Only pulse clock if is generated
  if (store.getState().clock.isGenerated) {
    // Check to see if time passed is more than time per pulse
    let diff = window.performance.now() - marker

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
