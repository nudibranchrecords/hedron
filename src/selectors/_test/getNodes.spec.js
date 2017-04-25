import test from 'tape'
import getNodes from '../getNodes'

test('(Selector) getNodes', (t) => {
  const state = {
    nodes: {
      XX: { foo: 1 },
      YY: { foo: 2 },
      ZZ: { foo: 3 }
    }
  }

  const expected = [
    { foo: 1 },
    { foo: 2 },
    { foo: 3 }
  ]

  const actual = getNodes(state, ['XX', 'YY', 'ZZ'])

  t.deepEqual(actual, expected, 'Returns array of nodes')
  t.end()
})

test('(Selector) getNodes - Nodes dont exist', (t) => {
  const state = {
    nodes: {
      XX: { foo: 1 },
      YY: { foo: 2 },
      ZZ: { foo: 3 }
    }
  }

  t.throws(getNodes.bind(null, state, ['AA']), Error, 'Throws an error')
  t.end()
})
