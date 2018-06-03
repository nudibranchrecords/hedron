import 'babel-polyfill'
import now from 'performance-now'
import { takeEvery, put, call } from 'redux-saga/effects'
import { inputFired } from '../inputs/actions'
import * as a from './actions'

const ppqn = 24
let pulses, delta, beats, lastBar, totalBeats
let seqStepCount = 0 // Sequencer step count
const ppSeqStep = ppqn / 8 // Pulses per 8th beat
const seqStepPerBar = ppSeqStep * 8 * 4

export const clockReset = () => {
  pulses = 0
  delta = 0
  beats = 0
  totalBeats = 0
  lastBar = now()
}
export const clockSnap = () => {
  if (pulses > ppqn * 0.5) {
    beats++
    totalBeats++
    pulses = -1
  } else {
    pulses = 0
  }
  delta = totalBeats
}

export const newPulse = () => {
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
  delta = pulses / ppqn + totalBeats
  return {
    pulses,
    beats,
    delta,
    seqStepCount
  }
}

export const calcBpm = () => {
  let newBar = now()
  let msperbar = newBar - lastBar
  lastBar = newBar
  return Math.round(240000 / msperbar)
}

export function* clockUpdate () {
  const info = yield call(newPulse)
  yield put(inputFired('lfo', info.delta, {
    type: 'lfo'
  }))

  if (info.seqStepCount % ppSeqStep === 0) {
    yield put(inputFired('seq-step', info.seqStepCount / ppSeqStep))
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
  yield takeEvery('CLOCK_SNAP', clockSnap)
}

clockReset()
