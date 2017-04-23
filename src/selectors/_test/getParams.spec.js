import test from 'tape'
import getParams from '../getParams'

test('(Selector) getParams', (t) => {
  const state = {
    params: {
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

  const actual = getParams(state, ['XX', 'YY', 'ZZ'])

  t.deepEqual(actual, expected, 'Returns array of params')
  t.end()
})

test('(Selector) getParams - Params dont exist', (t) => {
  const state = {
    params: {
      XX: { foo: 1 },
      YY: { foo: 2 },
      ZZ: { foo: 3 }
    }
  }

  t.throws(getParams.bind(null, state, ['AA']), Error, 'Throws an error')
  t.end()
})
