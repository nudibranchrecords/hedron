import test from 'tape'
import { getAssignedLinks } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) inputs - getAssignedLinks', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    inputLinks: {
      XX: { foo: 1 },
      YY: { foo: 2 },
      ZZ: { foo: 3 }
    }
  }
  deepFreeze(state)

  const expected = [
    { foo: 1 },
    { foo: 2 },
    { foo: 3 }
  ]

  const actual = getAssignedLinks(state, 'audio_0')

  t.deepEqual(actual, expected, 'Returns array of nodes')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - input doesnt exist', (t) => {
  const state = {
    inputs: {
      foo_input: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    inputLinks: {
      XX: { foo: 1 },
      YY: { foo: 2 },
      ZZ: { foo: 3 }
    }
  }
  deepFreeze(state)

  const expected = []

  const actual = getAssignedLinks(state, 'non_existing_input')

  t.deepEqual(actual, expected, 'Returns empty array')
  t.end()
})

test('(Selector) inputs - getAssignedLinks - inputLinks dont exist', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedLinkIds: ['XX', 'YY', 'ZZ']
      }
    },
    inputLinks: {}
  }

  t.throws(getAssignedLinks.bind(null, state, 'audio_0'), Error, 'Throws an error')
  t.end()
})
