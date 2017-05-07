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

test('(Reducer) clockReducer - resets beat on CLOCK_RESET', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    beat: 100
  }

  deepFreeze(originalState)

  expectedState = {
    beat: 0
  }

  actualState = paramsReducer(originalState, {
    type: 'CLOCK_RESET'
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

test('(Reducer) clockReducer - updates BPM on CLOCK_BPM_UPDATE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    bpm: undefined
  }

  deepFreeze(originalState)

  expectedState = {
    bpm: 120
  }

  actualState = paramsReducer(originalState, {
    type: 'CLOCK_BPM_UPDATE',
    payload: {
      bpm: 120
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    bpm: 110
  }

  actualState = paramsReducer(actualState, {
    type: 'CLOCK_BPM_UPDATE',
    payload: {
      bpm: 110
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
