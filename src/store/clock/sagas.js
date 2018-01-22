import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import { inputFired } from '../inputs/actions'
import now from 'performance-now'

const actualPpqn = 24
const ppqn = 48
const pulsesPerCalc = 96
let calcPulseCount = 0
let deltaInc = Math.PI / ppqn
let pulses, delta, beats, lastPulse, bpm

export const clockReset = () => {
  pulses = 0
  delta = 0
  beats = 0
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
  const p = action.payload
  const info = yield call(newPulse)
  yield put(inputFired('lfo', info.delta, { type: 'lfo' }))

  if (!p.bpmCalcIgnore) {
    calcPulseCount++
    if (calcPulseCount === pulsesPerCalc) {
      calcPulseCount = 0
      bpm = yield call(calcBpm)
    }
  }

  if (info.pulses === 0) {
    yield put(a.clockBeatInc())
  }

  if (info.beats === 0) {
    bpm = p.bpm || bpm
    yield put(a.clockBpmUpdate(bpm))
  }
}

export function* watchClock () {
  yield takeEvery('CLOCK_PULSE', clockUpdate)
  yield takeEvery('CLOCK_RESET', clockReset)
}

clockReset()
