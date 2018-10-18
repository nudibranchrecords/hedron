import test from 'tape'
import deepFreeze from 'deep-freeze'
import inputLinkReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
import * as a from '../actions'

returnsPreviousState(inputLinkReducer)

test('(Reducer) inputLinkReducer - Adds link on rInputLinkCreate()', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      foo: 'bar',
    },
    '02': {
      lorem: 'ipsum',
    },
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      foo: 'bar',
    },
    '02': {
      lorem: 'ipsum',
    },
    '03': {
      bar: 'foo',
    },
  }

  actualState = inputLinkReducer(originalState, a.rInputLinkCreate('03', { bar: 'foo' }))

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) inputLinkReducer - Removes link on rInputLinkDelete()', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      foo: 'bar',
    },
    '02': {
      lorem: 'ipsum',
    },
    '03': {
      bar: 'foo',
    },
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      foo: 'bar',
    },
    '02': {
      lorem: 'ipsum',
    },
  }

  actualState = inputLinkReducer(originalState, a.rInputLinkDelete('03'))

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) inputLinkReducer - Replaces all on inputLinksReplaceAll()', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      foo: 'bar',
    },
    '02': {
      lorem: 'ipsum',
    },
    '03': {
      bar: 'foo',
    },
  }

  deepFreeze(originalState)

  expectedState = {
    'XX': {
      foo: 'woo',
    },
    'YY': {
      lorem: 'wee',
    },
  }

  actualState = inputLinkReducer(originalState, a.inputLinksReplaceAll({
    'XX': {
      foo: 'woo',
    },
    'YY': {
      lorem: 'wee',
    },
  }))

  t.deepEqual(actualState, expectedState)

  t.end()
})

test('(Reducer) inputLinkReducer - handle inputLinkShotArm / inputLinkShotDisarm', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      id: '01',
    },
    '02': {
      id: '02',
      armed: true,
    },
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      id: '01',
      armed: true,
    },
    '02': {
      id: '02',
      armed: true,
    },
  }

  actualState = inputLinkReducer(originalState, a.inputLinkShotArm('01'))

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      id: '01',
      armed: true,
    },
    '02': {
      id: '02',
      armed: false,
    },
  }

  actualState = inputLinkReducer(actualState, a.inputLinkShotDisarm('02'))

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      id: '01',
      armed: true,
    },
    '02': {
      id: '02',
      armed: true,
    },
  }

  actualState = inputLinkReducer(actualState, a.inputLinkShotArm('02'))

  t.deepEqual(actualState, expectedState)

  t.end()
})
