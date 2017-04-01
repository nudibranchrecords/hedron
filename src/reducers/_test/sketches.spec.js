import test from 'tape'
import deepFreeze from 'deep-freeze'
import sketchesReducer from '../sketches'

test('(Reducer) sketchesReducer', (t) => {
  let actualState
  let expectedState = {
    sketch_1: {
      title: 'Sketch 1',
      params: ['01', '02']
    },
    sketch_2: {
      title: 'Sketch 2',
      params: ['03', '04']
    }
  }

  deepFreeze(expectedState)
  actualState = sketchesReducer(expectedState, {})
  t.deepEqual(actualState, expectedState,
    'Returns the previous state if an action was no matched')
  actualState = sketchesReducer(actualState, { type: '@@@@@@@' })
  t.deepEqual(actualState, expectedState,
    'Returns the previous state if an action was no matched')

  t.end()
})
