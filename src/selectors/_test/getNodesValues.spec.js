import test from 'tape'
import getNodesValues from '../getNodesValues'

test('(Selector) getNodesValues', (t) => {
  const state = {
    nodes: {
      XX: {
        key: 'shape',
        value: 'triangle',
      },
      YY: {
        key: 'rate',
        value: 2,
      },
    },
  }

  const expected = {
    shape: 'triangle',
    rate: 2,
  }

  const actual = getNodesValues(state, ['XX', 'YY'])

  t.deepEqual(actual, expected, 'Returns object key pair')
  t.end()
})

test('(Selector) getNodesValues - undefined array', (t) => {
  const state = {
    nodes: {
      XX: {
        key: 'shape',
        value: 'triangle',
      },
      YY: {
        key: 'rate',
        value: 2,
      },
    },
  }

  const expected = {}

  const actual = getNodesValues(state, undefined)

  t.deepEqual(actual, expected, 'Returns empty object')
  t.end()
})
