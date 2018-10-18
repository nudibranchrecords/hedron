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
      bankIndex: 0,
    },
    yyy: {
      title: 'Bar',
      bankIndex: 0,
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
        bankIndex: 0,
      },
      yyy: {
        title: 'Bar',
        bankIndex: 0,
      },
    },
  }

  actualState = midiReducer(actualState, a.midiMessage('xxx', lastMessage))

  t.deepEqual(actualState, expectedState, 'updates message info')

  expectedState = {
    learning: false,
    devices: {
      xxx: {
        title: 'Foo',
        lastMessage,
        bankIndex: 3,
      },
      yyy: {
        title: 'Bar',
        bankIndex: 1,
      },
    },
  }

  actualState = midiReducer(actualState, a.midiDeviceBankChange('yyy', 1))
  actualState = midiReducer(actualState, a.midiDeviceBankChange('xxx', 3))

  t.deepEqual(actualState, expectedState, 'changes bank')

  t.end()
})
