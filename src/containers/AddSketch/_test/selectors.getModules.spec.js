import test from 'tape'
import { getModules } from '../selectors'

test('(Selector) getModules', (t) => {
  const state = {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
      },
      bar: {
        defaultTitle: 'Bar',
      },
    },
  }

  const expected = [
    {
      title: 'Foo',
      id: 'foo',
    },
    {
      title: 'Bar',
      id: 'bar',
    },
  ]

  const actual = getModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id')
  t.end()
})
