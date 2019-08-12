import test from 'tape'
import deepFreeze from 'deep-freeze'
import midiReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
import * as a from '../actions'

returnsPreviousState(midiReducer)

test('(Reducer) midiReducer', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    learning: false,
    devices: {},
  }

  deepFreeze(originalState)

  expectedState = {
    learning: {
      id: 'XXX',
      type: 'foo',
    },
    devices: {},
  }

  actualState = midiReducer(originalState, a.midiStartLearning('XXX', 'foo'))

  t.deepEqual(actualState, expectedState, 'sets id on midiStartLearning')

  expectedState = {
    learning: false,
    devices: {},
  }

  actualState = midiReducer(originalState, a.midiStopLearning())

  t.deepEqual(actualState, expectedState, 'sets learning to false on midiStopLearning')

  const devices = {
    xxx: {
      title: 'Foo',
    },
    yyy: {
      title: 'Bar',
    },
  }

  expectedState = {
    learning: false,
    devices,
  }

  actualState = midiReducer(actualState, a.midiUpdateDevices(devices))

  t.deepEqual(actualState, expectedState, 'updates devices list on midiUpdateDevices')

  const lastMessage = {
    data: [0, 1, 2],
    timeStamp: 100,
  }

  expectedState = {
    learning: false,
    devices: {
      xxx: {
        title: 'Foo',
        lastMessage,
      },
      yyy: {
        title: 'Bar',
      },
    },
  }

  actualState = midiReducer(actualState, a.midiMessage('xxx', lastMessage))

  t.deepEqual(actualState, expectedState, 'updates message info')

  t.end()
})
