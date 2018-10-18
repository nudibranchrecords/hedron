import test from 'tape'
import deepFreeze from 'deep-freeze'

export const returnsPreviousState = (reducer) => {
  test(`(Reducer) ${reducer.name} - Returns previous state if no action matched`, (t) => {
    let actualState, expectedState

    expectedState = {
      'foo': 'bar',
      'lorem': ['ipsum', 'dollar'],
      'hello': {
        world1: 1,
        world2: 2,
      },
    }

    deepFreeze(expectedState)

    actualState = reducer(expectedState, {})
    t.deepEqual(actualState, expectedState)
    actualState = reducer(actualState, { type: '@@@@@@@' })
    t.deepEqual(actualState, expectedState)

    t.end()
  })
}
