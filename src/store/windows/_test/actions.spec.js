import test from 'tape'
import { windowSendOutput } from '../actions'

test('(Action Creator) windowSendOutput', (t) => {
  let actual = windowSendOutput(1)
  let expected = {
    type: 'WINDOW_SEND_OUTPUT',
    payload: {
      index: 1,
    },
  }
  t.deepEqual(actual, expected, 'Creates action to send visual output to external monitor')
  t.end()
})
