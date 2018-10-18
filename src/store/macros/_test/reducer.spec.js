import test from 'tape'
import deepFreeze from 'deep-freeze'
import macroReducer from '../reducer'
import { returnsPreviousState } from '../../../testUtils'
import * as a from '../actions'

returnsPreviousState(macroReducer)

test('(Reducer) macroReducer - Adds macro on rMacroCreate()', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    items: {
      '01': {
        id: '01',
        nodeId: 'xxx',
        targetParamLinks: [],
      },
    },
  }

  deepFreeze(originalState)

  expectedState = {
    items: {
      '01': {
        id: '01',
        nodeId: 'xxx',
        targetParamLinks: [],
      },
      '02': {
        id: '02',
        nodeId: 'yyy',
        targetParamLinks: [],
      },
    },
  }

  actualState = macroReducer(originalState, a.rMacroCreate('02', 'yyy'))

  t.deepEqual(actualState, expectedState)

  t.end()
})
