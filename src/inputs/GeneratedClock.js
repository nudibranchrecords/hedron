import { clockPulse } from '../store/clock/actions'

let store
let requestId
let marker
let bpm = 120
let mspp = (60 / (bpm * 24)) * 1000

const loop = () => {
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

  requestId = requestAnimationFrame(loop)
}

export const startGeneratedClock = () => {
  if (!requestId) {
    marker = window.performance.now()
    loop()
  }
}

export const stopGeneratedClock = () => {
  cancelAnimationFrame(requestId)
  requestId = undefined
}

export const initiateGenerateClock = (injectedStore) => {
  store = injectedStore
}
