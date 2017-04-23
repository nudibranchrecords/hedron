import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import now from 'performance-now'

let pulses = 0
let beats = 0
let lastBar = now()

export const newPulse = () => {
  pulses++
  if (pulses > 23) {
    pulses = 0
    beats++
    if (beats > 3) {
      beats = 0
    }
  }
  return { pulses, beats }
}

export const calcBpm = () => {
  let newBar = now()
  let msperbar = newBar - lastBar
  lastBar = newBar
  return Math.round(240000 / msperbar)
}

export function* clockUpdate () {
  const info = yield call(newPulse)

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
}
