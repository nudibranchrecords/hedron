import test from 'tape'
import { getAssignedNodes } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) inputs - getAssignedNodes', (t) => {
  const state = {
    inputs: {
      audio_0: {
        assignedNodeIds: ['XX', 'YY', 'ZZ']
      }
    },
    nodes: {
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

  const actual = getAssignedNodes(state, 'audio_0')

  t.deepEqual(actual, expected, 'Returns array of nodes')
  t.end()
})

test('(Selector) inputs - getAssignedNodes - Nodes dont exist', (t) => {
  const state = {
    inputs: {
      assignedNodeIds: {
        audio_0: ['XX', 'YY', 'ZZ']
      }
    },
    nodes: {}
  }

  t.throws(getAssignedNodes.bind(null, state, 'audio_0'), Error, 'Throws an error')
  t.end()
})
