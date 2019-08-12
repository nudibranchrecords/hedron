import test from 'tape'
import deepFreeze from 'deep-freeze'
import projectReducer from '../reducer'

import { returnsPreviousState } from '../../../testUtils'
returnsPreviousState(projectReducer)

test('(Reducer) projectReducer - Updates filepath on PROJECT_FILEPATH_UPDATE', (t) => {
  let actual, expectedState

  const originalState = {
    filePath: undefined,
  }

  deepFreeze(originalState)

  expectedState = {
    filePath: 'some/path',
  }

  actual = projectReducer(originalState, {
    type: 'PROJECT_FILEPATH_UPDATE',
    payload: {
      filePath: 'some/path',
    },
  })

  t.deepEqual(actual, expectedState)

  expectedState = {
    filePath: 'some/other/path',
  }

  actual = projectReducer(actual, {
    type: 'PROJECT_FILEPATH_UPDATE',
    payload: {
      filePath: 'some/other/path',
    },
  })

  t.deepEqual(actual, expectedState)

  t.end()
})
