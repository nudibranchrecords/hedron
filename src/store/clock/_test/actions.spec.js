import test from 'tape'
import { clockPulse, clockBeatInc } from '../actions'

test('(Action Creator) clockPulse', (t) => {
  let actual = clockPulse()
  let expected = {
    type: 'CLOCK_PULSE'
  }
  t.deepEqual(actual, expected, 'Creates action for single midi clock pulse')
  t.end()
})

test('(Action Creator) clockBeatInc', (t) => {
  let actual = clockBeatInc()
  let expected = {
    type: 'CLOCK_BEAT_INC'
  }
  t.deepEqual(actual, expected, 'Creates action to incremenent beat')
  t.end()
})
