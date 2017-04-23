import test from 'tape'
import deepFreeze from 'deep-freeze'
import paramsReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(paramsReducer)

test('(Reducer) clockReducer -  - Increases beat on CLOCK_BEAT_INC', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 1
  }

  deepFreeze(originalState)

  expectedState = {
    beat: 2
  }

  actualState = paramsReducer(originalState, {
    type: 'CLOCK_BEAT_INC'
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    beat: 3
  }

  actualState = paramsReducer(actualState, {
    type: 'CLOCK_BEAT_INC'
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) clockReducer - loops back to 0 after 64 beats', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 62
  }

  deepFreeze(originalState)

  expectedState = {
    beat: 63
  }

  actualState = paramsReducer(originalState, {
    type: 'CLOCK_BEAT_INC'
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    beat: 0
  }

  actualState = paramsReducer(actualState, {
    type: 'CLOCK_BEAT_INC'
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
