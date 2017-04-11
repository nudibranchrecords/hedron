import test from 'tape'
import deepFreeze from 'deep-freeze'

import sketchesReducer from '../reducer'

test('(Reducer) sketchesReducer - Replaces all sketches and params on PROJECT_LOAD_SUCCESS', (t) => {
  let originalState, actual, newData, expectedState

  originalState = {
    modules: {},
    params: {
      p01: 'something',
      p02: 'something',
      p03: 'something',
      p04: 'something'
    },
    instances: {
      s01: {
        moduleId: 'cubey',
        title: 'Cubey 1',
        paramIds: ['p01', 'p02']
      },
      s02: {
        moduleId: 'swirly',
        title: 'Swirly 1',
        paramIds: ['p03', 'p04']
      }
    }
  }

  newData = {
    params: {
      pZZ: 'something',
      pTT: 'something',
      pXX: 'something',
      pYY: 'something',
      pAA: 'something',
      pBB: 'something'
    },
    instances: {
      sRR: {
        moduleId: 'cubey',
        title: 'Cubey 1',
        paramIds: ['pZZ', 'pTT']
      },
      sFF: {
        moduleId: 'swirly',
        title: 'Swirly 1',
        paramIds: ['pXX', 'pYY']
      },
      sDD: {
        moduleId: 'swirly',
        title: 'Swirly 1',
        paramIds: ['pAA', 'pBB']
      }
    }
  }

  deepFreeze(originalState)

  expectedState = {
    modules: {},
    ...newData
  }

  actual = sketchesReducer(originalState, {
    type: 'PROJECT_LOAD_SUCCESS',
    payload: {
      data: {
        project: {},
        sketches: newData
      }
    }
  })

  t.deepEqual(actual, expectedState, 'Replaces entire state with new stuff')
  t.end()
})
