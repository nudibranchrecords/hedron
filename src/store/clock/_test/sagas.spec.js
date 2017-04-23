import test from 'tape'

import { takeEvery, put, call } from 'redux-saga/effects'
import { watchClock, clockUpdate, newPulse, calcBpm } from '../sagas'
import * as a from '../actions'

test('(Saga) watchClock', (t) => {
  const generator = watchClock()
  t.deepEqual(
    generator.next().value,
    takeEvery('CLOCK_PULSE', clockUpdate)
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
    beats: 1
  }

  t.equal(generator.next(info).done, true, 'Generator ends')
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
    beats: 1
  }

  t.deepEqual(
    generator.next(info).value,
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
    beats: 0
  }

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
