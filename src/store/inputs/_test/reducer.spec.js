import test from 'tape'
import inputsReducer from '../reducer'
import deepFreeze from 'deep-freeze'
import * as a from '../actions'

import { returnsPreviousState } from '../../../../testUtils'
returnsPreviousState(inputsReducer)

test('(Reducer) inputsReducer - Updates value on INPUT_FIRED', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      value: 0,
    },
    audio_1: {
      value: 0,
    },
  }

  expectedState = {
    audio_0: {
      value: 0.9,
    },
    audio_1: {
      value: 0,
    },
  }

  actual = inputsReducer(originalState, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_0',
      value: 0.9,
    },
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      value: 0.9,
    },
    audio_1: {
      value: 0.4,
    },
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_1',
      value: 0.4,
    },
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      value: 0.9,
    },
    audio_1: {
      value: 0.4,
    },
  }

  actual = inputsReducer(actual, {
    type: 'INPUT_FIRED',
    payload: {
      inputId: 'audio_XXXX',
      value: 0.9,
    },
  })

  t.deepEqual(actual, expectedState, 'does nothing if input doesnt exist in state')

  t.end()
})

test('(Reducer) inputsReducer - Replaces all on INPUTS_REPLACE_ALL', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      value: 0,
    },
    audio_1: {
      value: 0,
    },
  }

  deepFreeze(originalState)

  expectedState = {
    audio_X: {
      value: 0.9,
    },
    audio_T: {
      value: 0.5,
    },
  }

  actual = inputsReducer(originalState, {
    type: 'INPUTS_REPLACE_ALL',
    payload: {
      inputs: expectedState,
    },
  })

  t.deepEqual(actual, expectedState)

  t.end()
})

test('(Reducer) inputsReducer - Adds node and device on inputAssignedLinkCreate', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedLinkIds: [],
    },
    audio_1: {
      assignedLinkIds: [],
    },
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: [],
    },
  }

  actual = inputsReducer(originalState, a.inputAssignedLinkCreate('audio_0', 'XX'))

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: ['YY'],
    },
  }

  actual = inputsReducer(actual, a.inputAssignedLinkCreate('audio_1', 'YY'))

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: ['YY', 'ZZ'],
    },
  }

  actual = inputsReducer(actual, a.inputAssignedLinkCreate('audio_1', 'ZZ'))

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: ['YY', 'ZZ'],
    },
    midi_XXX: {
      assignedLinkIds: ['AA'],
    },
  }

  actual = inputsReducer(actual, a.inputAssignedLinkCreate('midi_XXX', 'AA'))

  t.deepEqual(actual, expectedState, 'Adds input and assigns node when input doesnt exist')

  t.end()
})

test('(Reducer) inputsReducer - Deletes link on INPUT_ASSIGNED_LINK_DELETE', (t) => {
  let actual, expectedState

  const originalState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: ['YY', 'ZZ'],
    },
  }

  deepFreeze(originalState)

  expectedState = {
    audio_0: {
      assignedLinkIds: ['XX'],
    },
    audio_1: {
      assignedLinkIds: ['ZZ'],
    },
  }

  actual = inputsReducer(originalState, a.inputAssignedLinkDelete('audio_1', 'YY'))

  t.deepEqual(actual, expectedState)

  expectedState = {
    audio_0: {
      assignedLinkIds: [],
    },
    audio_1: {
      assignedLinkIds: ['ZZ'],
    },
  }

  actual = inputsReducer(actual, a.inputAssignedLinkDelete('audio_0', 'XX'))

  t.deepEqual(actual, expectedState)

  t.end()
})
