import test from 'tape'
import deepFreeze from 'deep-freeze'
import inputsReducer from '../reducer'

import { returnsPreviousState } from '../../../testUtils'
returnsPreviousState(inputsReducer)

test('(Reducer) inputsReducer - Updates value on INPUT_FIRED', (t) => {
  let actual, expectedState

  const originalState = {
    values: {
      audio_0: 0.5,
      audio_1: 0.1
    }
  }

  deepFreeze(originalState)

  expectedState = {
    values: {
      audio_0: 0.9,
      audio_1: 0.1
    }
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.9
    }
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    values: {
      audio_0: 0.9,
      audio_1: 0.4
    }
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_1',
      value: 0.4
    }
  })

  t.deepEqual(actual, expectedState)

  t.end()
})
