import test from 'tape'
import deepFreeze from 'deep-freeze'
import displaysReducer from '../reducer'
import * as a from '../actions'

import { returnsPreviousState } from '../../../testUtils'
returnsPreviousState(displaysReducer)

test('(Reducer) displaysReducer - Updates deviceList on displaysListUpdate', (t) => {
  let actual, expectedState

  const originalState = {
    list: [],
  }

  deepFreeze(originalState)

  const newList = [
    {
      foo: 'bar',
    },
    {
      lorem: 'ipsum',
    },
  ]

  expectedState = {
    list: newList,
  }

  actual = displaysReducer(originalState, a.displaysListUpdate(newList))

  t.deepEqual(actual, expectedState)
  t.end()
})
