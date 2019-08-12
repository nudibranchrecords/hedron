import test from 'tape'

import { takeEvery, put, call } from 'redux-saga/effects'
import { watchClock, clockUpdate, newPulse, calcBpm, clockReset, clockSnap } from '../sagas'
import * as a from '../actions'
import { inputFired } from '../../inputs/actions'

test('(Saga) watchClock', (t) => {
  const generator = watchClock()
  t.deepEqual(
    generator.next().value,
    takeEvery('CLOCK_PULSE', clockUpdate)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('CLOCK_RESET', clockReset)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('CLOCK_SNAP', clockSnap)
  )
  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) clockUpdate (off beat)', (t) => {
  const generator = clockUpdate()
  t.deepEqual(
    generator.next().value,
    call(newPulse)
  )

  const info = {
    pulses: 1,
    beats: 1,
    delta: 0.1,
  }

  t.deepEqual(
    generator.next(info).value,
    put(inputFired('lfo', info.delta, { type: 'lfo' }))
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) clockUpdate (on beat)', (t) => {
  const generator = clockUpdate()
  t.deepEqual(
    generator.next().value,
    call(newPulse)
  )

  const info = {
    pulses: 0,
    beats: 1,
    delta: 0.1,
  }

  generator.next(info)

  t.deepEqual(
    generator.next().value,
    put(a.clockBeatInc())
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) clockUpdate (on bar)', (t) => {
  const generator = clockUpdate()
  t.deepEqual(
    generator.next().value,
    call(newPulse)
  )

  const info = {
    pulses: 0,
    beats: 0,
    delta: 0.1,
  }

  generator.next(info)

  t.deepEqual(
    generator.next(info).value,
    put(a.clockBeatInc())
  )

  t.deepEqual(
    generator.next().value,
    call(calcBpm)
  )

  const bpm = 120

  t.deepEqual(
    generator.next(bpm).value,
    put(a.clockBpmUpdate(bpm))
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
