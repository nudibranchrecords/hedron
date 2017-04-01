import test from 'tape'
import paramsReducer from '../params'
import deepFreeze from 'deep-freeze'

test('(Reducer) paramsReducer', (t) => {
  let originalState, actualState, expectedState

  expectedState = {
    '01': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.2
    },
    '03': {
      title: 'Rotation X',
      key: 'rotX',
      value: 0.3
    },
    '04': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 0.4
    }
  }

  deepFreeze(expectedState)

  actualState = paramsReducer(expectedState, {})
  t.deepEqual(actualState, expectedState,
    'Returns the previous state if an action was no matched')
  actualState = paramsReducer(actualState, { type: '@@@@@@@' })
  t.deepEqual(actualState, expectedState,
    'Returns the previous state if an action was no matched')

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
      value: 0.1
    },
    '02': {
      title: 'Rotation Y',
      key: 'rotY',
      value: 1
    }
  }

  actualState = paramsReducer(originalState, {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      paramId: '02',
      value: 1
    }
  })

  t.deepEqual(actualState, expectedState,
    'Updates correct param value on PARAM_VALUE_CHANGE')
  t.end()
})
