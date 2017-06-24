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
      foo: 'bar'
    },
    '02': {
      lorem: 'ipsum'
    }
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      foo: 'bar'
    },
    '02': {
      lorem: 'ipsum'
    },
    '03': {
      bar: 'foo'
    }
  }

  actualState = inputLinkReducer(originalState, a.rInputLinkCreate('03', { bar: 'foo' }))

  t.deepEqual(actualState, expectedState)

  t.end()
})
