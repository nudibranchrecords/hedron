import test from 'tape'
import getNodeInputId from '../getNodeInputId'

test('(Selector) getNodeInputId (normal)', (t) => {
  const state = {
    nodes: {
      xxx: {
        input: {
          id: 'YYY',
        },
      },
    },
  }

  const actual = getNodeInputId(state, 'xxx')

  t.equal(actual, 'YYY', 'Returns id')
  t.end()
})

test('(Selector) getNodeInputId (false)', (t) => {
  const state = {
    nodes: {
      xxx: {
        input: false,
      },
    },
  }

  const actual = getNodeInputId(state, 'xxx')

  t.equal(actual, false, 'Returns false')
  t.end()
})

test('(Selector) getNodeInputId (midi)', (t) => {
  const state = {
    nodes: {
      xxx: {
        input: {
          id: 'something',
          type: 'midi',
        },
      },
    },
  }

  const actual = getNodeInputId(state, 'xxx')

  t.equal(actual, 'midi', 'Returns "midi" instead of actual id')
  t.end()
})

