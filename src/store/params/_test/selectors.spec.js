import test from 'tape'
import { getParamInputId } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getProjectData', (t) => {
  const state = {
    params: {
      XXX: {
        inputId: 'audio_0'
      }
    }
  }
  deepFreeze(state)

  const actual = getParamInputId(state, 'XXX')

  t.deepEqual(actual, 'audio_0', 'Returns input id')
  t.end()
})
