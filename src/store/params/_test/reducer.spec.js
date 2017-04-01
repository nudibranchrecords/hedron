import test from 'tape'
import paramsReducer from '../reducer'
import deepFreeze from 'deep-freeze'
import { returnsPreviousState } from '../../../testUtils'

returnsPreviousState(paramsReducer)

test('(Reducer) paramsReducer - Updates correct param value on PARAM_VALUE_CHANGE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    }
  }

  deepFreeze(originalState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      paramId: '01',
      value: 1
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 2
    }
  }

  actualState = paramsReducer(actualState, {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      paramId: '02',
      value: 2
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
