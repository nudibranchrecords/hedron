import test from 'tape'
import deepFreeze from 'deep-freeze'

import sketchesReducer from '../reducer'

test('(Reducer) sketchesReducer - Updates correct param value on SKETCHES_PARAM_VALUE_CHANGE', (t) => {
  let originalState, expectedState, actualState

  originalState = {
    modules: {},
    instances: {},
    params: {
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
  }

  deepFreeze(originalState)

  expectedState = {
    modules: {},
    instances: {},
    params: {
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
  }

  actualState = sketchesReducer(originalState, {
    type: 'SKETCHES_PARAM_VALUE_UPDATE',
    payload: {
      id: '01',
      value: 1
    }
  })

  t.deepEqual(actualState, expectedState)

  expectedState = {
    modules: {},
    instances: {},
    params: {
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
  }

  actualState = sketchesReducer(actualState, {
    type: 'SKETCHES_PARAM_VALUE_UPDATE',
    payload: {
      id: '02',
      value: 2
    }
  })

  t.deepEqual(actualState, expectedState)

  t.end()
})
