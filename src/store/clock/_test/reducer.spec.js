import test from 'tape'
import paramsReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
import * as a from '../actions'

returnsPreviousState(paramsReducer)

test('(Reducer) clockReducer -  - Increases beat on CLOCK_BEAT_INC', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 1,
  }

  expectedState = {
    beat: 2,
  }

  actualState = paramsReducer(originalState, a.clockBeatInc())

  t.deepEqual(actualState, expectedState)

  expectedState = {
    beat: 3,
  }

  actualState = paramsReducer(actualState, a.clockBeatInc())

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) clockReducer - resets beat on CLOCK_RESET', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 100,
  }

  expectedState = {
    beat: 0,
  }

  actualState = paramsReducer(originalState, a.clockReset())

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) clockReducer - loops back to 0 after 64 beats', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 62,
  }

  expectedState = {
    beat: 63,
  }

  actualState = paramsReducer(originalState, a.clockBeatInc())

  t.deepEqual(actualState, expectedState)

  expectedState = {
    beat: 0,
  }

  actualState = paramsReducer(actualState, a.clockBeatInc())

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) clockReducer - updates BPM on CLOCK_BPM_UPDATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    bpm: undefined,
  }

  expectedState = {
    bpm: 120,
  }

  actualState = paramsReducer(originalState, a.clockBpmUpdate(120))

  t.deepEqual(actualState, expectedState)

  expectedState = {
    bpm: 110,
  }

  actualState = paramsReducer(actualState, a.clockBpmUpdate(110))

  t.deepEqual(actualState, expectedState)

  t.end()
})
