import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import { inputFired } from '../inputs/actions'
import now from 'performance-now'

const ppqn = 48
let deltaInc = Math.PI / ppqn
let pulses, delta, beats, lastBar
let pp16Count = 0
const pp16 = ppqn / 16 // Pulses per 16th beat
const pp16PerBar = pp16 * 16 * 4

export const clockReset = () => {
  pulses = 0
  delta = 0
  beats = 0
  lastBar = now()
}

export const newPulse = () => {
  pulses++
  delta += deltaInc
  pp16Count++

  if (pp16Count > pp16PerBar - 1) {
    pp16Count = 0
  }

  if (pulses > 23) {
    pulses = 0
    beats++
    if (beats > 3) {
      beats = 0
    }
  }
  return { pulses, beats, delta, pp16Count }
}

export const calcBpm = () => {
  let newBar = now()
  let msperbar = newBar - lastBar
  lastBar = newBar
  return Math.round(240000 / msperbar)
}

export function* clockUpdate () {
  const info = yield call(newPulse)
  yield put(inputFired('lfo', info.delta, { type: 'lfo' }))

  if (info.pp16Count % pp16 === 0) {
    yield put(inputFired('beat-16', info.pp16Count / pp16))
  }

  if (info.pulses === 0) {
    yield put(a.clockBeatInc())

    if (info.beats === 0) {
      const bpm = yield call(calcBpm)
      yield put(a.clockBpmUpdate(bpm))
    }
  }
}

export function* watchClock () {
  yield takeEvery('CLOCK_PULSE', clockUpdate)
  yield takeEvery('CLOCK_RESET', clockReset)
}

clockReset()
