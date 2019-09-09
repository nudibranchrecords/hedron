import deepFreeze from 'deep-freeze'
import midiReducer from '../reducer'

import * as a from '../actions'

test('(Reducer) midiReducer', () => {
  let originalState, expectedState, actualState

  originalState = {
    devices: {},
    connectedDeviceIds: [],
  }

  expectedState = {
    devices: {
      'Foo': {
        id: 'Foo',
        title: 'Foo',
        settings: {
          forceChannel: {
            value: false,
            label: '-',
          },
        },
      },
      'Bar': {
        id: 'Bar',
        title: 'Bar',
        settings: {
          forceChannel: {
            value: false,
            label: '-',
          },
        },
      },
    },
    connectedDeviceIds: ['Foo', 'Bar'],
  }

  deepFreeze(originalState)

  actualState = midiReducer(originalState, a.midiUpdateDevices({
    'Foo': {
      id: 'Foo',
      title: 'Foo',
    },
    'Bar': {
      id: 'Bar',
      title: 'Bar',
    },
  }))

  // Default settings added to devices when added, connected device Ids added
  expect(actualState).toEqual(expectedState)

  expectedState = {
    devices: {
      'Foo': {
        id: 'Foo',
        title: 'Foo',
        settings: {
          forceChannel: {
            value: 3,
            label: '3',
          },
        },
      },
      'Bar': {
        id: 'Bar',
        title: 'Bar',
        settings: {
          forceChannel: {
            value: false,
            label: '-',
          },
        },
      },
    },
    connectedDeviceIds: ['Foo', 'Bar'],
  }

  actualState = midiReducer(
    actualState,
    a.deviceSettingsUpdate('Foo',
      {
        forceChannel: {
          value: 3,
          label: '3',
        },
      }
    )
  )

  // Action to update settings should update the object
  expect(actualState).toEqual(expectedState)

  expectedState = {
    devices: {
      'Foo': {
        id: 'Foo',
        title: 'Foo',
        settings: {
          forceChannel: {
            value: 3,
            label: '3',
          },
        },
      },
      'Bar': {
        id: 'Bar',
        title: 'Bar',
        settings: {
          forceChannel: {
            value: false,
            label: '-',
          },
        },
      },
    },
    connectedDeviceIds: ['Bar'],
  }

  actualState = midiReducer(actualState, a.midiUpdateDevices({
    'Bar': {
      id: 'Bar',
      title: 'Bar',
    },
  }))

  // Removing pre-existing device should only remove the ID
  expect(actualState).toEqual(expectedState)

  expectedState = {
    devices: {
      'Foo': {
        id: 'Foo',
        title: 'Foo',
        settings: {
          forceChannel: {
            value: 3,
            label: '3',
          },
        },
      },
      'Bar': {
        id: 'Bar',
        title: 'Bar',
        settings: {
          forceChannel: {
            value: false,
            label: '-',
          },
        },
      },
    },
    connectedDeviceIds: ['Foo', 'Bar'],
  }

  actualState = midiReducer(actualState, a.midiUpdateDevices({
    'Foo': {
      id: 'Foo',
      title: 'Foo',
    },
    'Bar': {
      id: 'Bar',
      title: 'Bar',
    },
  }))

  // Adding device back should only add the ID (not override the settings)
  expect(actualState).toEqual(expectedState)
})
