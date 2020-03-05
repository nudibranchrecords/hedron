import '@babel/polyfill'
import now from 'performance-now'
import { inputFired } from './store/inputs/actions'
import * as a from './store/clock/actions'

const ppqn = 24
let pulses, beats, lastBar, totalBeats
let seqStepCount = 0 // Sequencer step count
const ppSeqStep = ppqn / 8 // Pulses per 8th beat
const seqStepPerBar = ppSeqStep * 8 * 4

let store

export const clockReset = () => {
  pulses = 0
  beats = 0
  totalBeats = 0
  seqStepCount = 0
  lastBar = now()
}

export const clockSnap = () => {
  // Get how many sequence pulses since last sequence step
  const seqMod = seqStepCount % ppqn

  if (pulses > ppqn * 0.5) {
    // Increase the beat
    beats++
    totalBeats++
    // Increase sequence pulses so it snaps to next beat
    seqStepCount += ppqn - seqMod - 1
    seqStepCount %= seqStepPerBar
    // Pulse will be 0 on next pulse, triggering clock beat behaviour
    pulses = -1
  } else {
    // Decrease sequence pulses so it snaps to current beat
    seqStepCount -= seqMod
    // Beat won't change on next pulse
    pulses = 0
  }
}

const newPulse = () => {
  pulses++
  seqStepCount++
  if (seqStepCount > seqStepPerBar - 1) {
    seqStepCount = 0
  }

  if (pulses > ppqn - 1) {
    pulses = 0
    beats++
    totalBeats++
    if (beats > 3) {
      beats = 0
    }
  }
  return {
    pulses,
    beats,
    seqStepCount,
    delta: pulses / ppqn + totalBeats,
  }
}

const calcBpm = () => {
  let newBar = now()
  let msperbar = newBar - lastBar
  lastBar = newBar
  return Math.round(240000 / msperbar)
}

export const clockUpdate = () => {
  const info = newPulse()

  store.dispatch(inputFired('lfo', info.delta, {
    type: 'lfo',
  }))

  if (info.seqStepCount % ppSeqStep === 0) {
    store.dispatch(inputFired('seq-step', info.seqStepCount / ppSeqStep, {
      type: 'seq-step',
    }))
  }

  if (info.pulses === 0) {
    store.dispatch(a.clockBeatInc())

    if (info.beats === 0) {
      const bpm = calcBpm()
      store.dispatch(a.clockBpmUpdate(bpm))
    }
  }
}

export const initiateClock = (injectedStore) => {
  store = injectedStore
  clockReset()
}
