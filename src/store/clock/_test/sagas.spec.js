import test from 'tape'

import { takeEvery, put, call } from 'redux-saga/effects'
import { watchClock, clockUpdate, newPulse } from '../sagas'
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

  const pulseNum = 5

  t.equal(generator.next(pulseNum).done, true, 'Generator ends')
  t.end()
})

test('(Saga) clockUpdate (on beat)', (t) => {
  const generator = clockUpdate()
  t.deepEqual(
    generator.next().value,
    call(newPulse)
  )

  const pulseNum = 0

  t.deepEqual(
    generator.next(pulseNum).value,
    put(a.clockBeatInc())
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
