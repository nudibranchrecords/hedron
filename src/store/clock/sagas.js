import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'

let pulses = 0

export const newPulse = () => {
  let pulse = pulses++
  if (pulse > 23) pulses = 0
  return pulse
}

export function* clockUpdate () {
  const pulseNum = yield call(newPulse)

  if (pulseNum === 0) {
    yield put(a.clockBeatInc())
  }
}

export function* watchClock () {
  yield takeEvery('CLOCK_PULSE', clockUpdate)
}
