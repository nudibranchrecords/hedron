import test from 'tape'
import { inputFired } from '../actions'

test('(Action Creator) inputFired', (t) => {
  let actual = inputFired('audio_0', 0.123)
  let expected = {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.123
    }
  }
  t.deepEqual(actual, expected, 'Creates action for when an input comes in')
  t.end()
})
