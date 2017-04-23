import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import now from 'performance-now'

let pulses = 0
let lastBeat = now()

export const newPulse = () => {
  pulses++
  if (pulses > 23) pulses = 0
  return pulses
}

export const calcBpm = () => {
  let newBeat = now()
  let mspp = newBeat - lastBeat
  lastBeat = newBeat
  return Math.round(60000 / mspp)
}

export function* clockUpdate () {
  const pulseNum = yield call(newPulse)

  if (pulseNum === 0) {
    yield put(a.clockBeatInc())
    const bpm = yield call(calcBpm)
    yield put(a.clockBpmUpdate(bpm))
  }
}

export function* watchClock () {
  yield takeEvery('CLOCK_PULSE', clockUpdate)
}
