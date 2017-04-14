import test from 'tape'
import { getAssignedParams } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) inputs - getAssignedParams', (t) => {
  const state = {
    inputs: {
      assignedParamIds: {
        audio_0: ['XX', 'YY', 'ZZ']
      }
    },
    sketches: {
      params: {
        XX: { foo: 1 },
        YY: { foo: 2 },
        ZZ: { foo: 3 }
      }
    }
  }
  deepFreeze(state)

  const expected = [
    { foo: 1 },
    { foo: 2 },
    { foo: 3 }
  ]

  const actual = getAssignedParams(state, 'audio_0')

  t.deepEqual(actual, expected, 'Returns array of params')
  t.end()
})

test('(Selector) inputs - getAssignedParams - Params dont exist', (t) => {
  const state = {
    inputs: {
      assignedParamIds: {
        audio_0: ['XX', 'YY', 'ZZ']
      }
    },
    sketches: {
      params: {}
    }
  }
  deepFreeze(state)

  t.throws(getAssignedParams.bind(null, state, 'audio_0'), Error, 'Throws an error')
  t.end()
})

