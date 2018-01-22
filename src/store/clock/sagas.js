import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import { inputFired } from '../inputs/actions'
import now from 'performance-now'

const actualPpqn = 24
const ppqn = 48
const pulsesPerCalc = 96
const pp16 = ppqn / 16 // Pulses per 16th beat
const pp16PerBar = pp16 * 16 * 4
let pp16Count = 0
let calcPulseCount = 0

let deltaInc = Math.PI / ppqn
let pulses, delta, beats, lastPulse, bpm

export const clockReset = () => {
  pulses = 0
  delta = 0
  beats = 0
  pp16Count = 0
  lastPulse = now()
}

export const newPulse = () => {
  pulses++
  delta += deltaInc

  if (pulses > ppqn - 1) {
    pulses = 0
    beats++
    if (beats > 3) {
      beats = 0
    }
  }
  return { pulses, beats, delta }
}

export const calcBpm = () => {
  let newPulse = now()
  // multiplying by actual PPQN because we need to
  // get genuine speed of clock (we're ignoring faked pulses here)
  let msPerBeat = (newPulse - lastPulse) * actualPpqn / pulsesPerCalc
  lastPulse = newPulse

  return Math.round(60000 / msPerBeat)
}

export function* clockUpdate (action) {
  pp16Count++
  const p = action.payload
  const info = yield call(newPulse)
  yield put(inputFired('lfo', info.delta, { type: 'lfo' }))

  if (pp16Count % pp16 === 0) {
    yield put(inputFired('beat-16', pp16Count / pp16, { type: 'beat' }))
  }

  if (!p.bpmCalcIgnore) {
    calcPulseCount++
    if (calcPulseCount === pulsesPerCalc) {
      calcPulseCount = 0
      bpm = yield call(calcBpm)
    }
  }

  if (info.pulses === 0) {
    bpm = p.bpm || bpm
    yield put(a.clockBeatInc(bpm))
  }

  if (pp16Count > pp16PerBar) {
    pp16Count = 0
  }
}

export function* watchClock () {
  yield takeEvery('CLOCK_PULSE', clockUpdate)
  yield takeEvery('CLOCK_RESET', clockReset)
}

clockReset()
