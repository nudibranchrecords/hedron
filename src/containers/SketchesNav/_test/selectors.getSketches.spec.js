import test from 'tape'
import { getSketches } from '../selectors'

test('(Selector) getSketches', (t) => {
  const state = {
    sketches: {
      foo: {
        title: 'Foo'
      },
      bar: {
        title: 'Bar'
      }
    }
  }

  const expected = [
    {
      title: 'Foo',
      id: 'foo'
    },
    {
      title: 'Bar',
      id: 'bar'
    }
  ]

  const actual = getSketches(state)

  t.deepEqual(actual, expected, 'Returns array of sketches with title and id')
  t.end()
})
