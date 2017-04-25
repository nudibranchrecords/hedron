import test from 'tape'
import { midiStartLearning, midiStopLearning } from '../actions'

test('(Action Creator) midiStartLearning', (t) => {
  let actual = midiStartLearning('param_x')
  let expected = {
    type: 'MIDI_START_LEARNING',
    payload: {
      nodeId: 'param_x'
    }
  }
  t.deepEqual(actual, expected, 'Creates action for when midi starts learning')
  t.end()
})

test('(Action Creator) midiSopLearning', (t) => {
  let actual = midiStopLearning()
  let expected = {
    type: 'MIDI_STOP_LEARNING'
  }
  t.deepEqual(actual, expected, 'Creates action for when stops learning')
  t.end()
})
