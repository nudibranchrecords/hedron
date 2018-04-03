import 'babel-polyfill'

import { takeEvery, put, call } from 'redux-saga/effects'
import * as a from './actions'
import { inputFired } from '../inputs/actions'
import now from 'performance-now'

const ppqn = 24
let deltaInc = Math.PI / ppqn
let pulses, delta, beats, lastBar
let seqStepCount = 0 // Sequencer step count
const ppSeqStep = ppqn / 8 // Pulses per 8th beat
const seqStepPerBar = ppSeqStep * 8 * 4

export const clockReset = () => {
  pulses = 0
  delta = 0
  beats = 0
  lastBar = now()
}

export const newPulse = () => {
  pulses++
  delta += deltaInc
  seqStepCount++

  if (seqStepCount > seqStepPerBar - 1) {
    seqStepCount = 0
  }

  if (pulses > 23) {
    pulses = 0
    beats++
    if (beats > 3) {
      beats = 0
    }
  }
  return { pulses, beats, delta, seqStepCount }
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
}

clockReset()
