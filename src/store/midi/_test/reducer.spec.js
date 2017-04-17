import test from 'tape'
import deepFreeze from 'deep-freeze'
import midiReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(midiReducer)

test('(Reducer) midiReducer, sets id on MIDI_START_LEARNING', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    learning: false
  }

  deepFreeze(originalState)

  expectedState = {
    learning: 'XXX'
  }

  actualState = midiReducer(originalState, {
    type: 'MIDI_START_LEARNING',
    payload: {
      paramId: 'XXX'
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) midiReducer, sets learning to false on MIDI_STOP_LEARNING', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    learning: 'XXX'
  }

  deepFreeze(originalState)

  expectedState = {
    learning: false
  }

  actualState = midiReducer(originalState, {
    type: 'MIDI_STOP_LEARNING'
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
