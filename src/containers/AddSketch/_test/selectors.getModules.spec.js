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
        category:'test',
        author:'tape',
        description:"this isn't a real module, just a test one",
      },
    },
  }

  const expected = [
    {
      title: 'Foo',
      category: undefined,
      author: undefined,
      description: undefined,
      filePath: undefined,
      id: 'foo',
    },
    {
      title: 'Bar',
      category: 'test',
      author: 'tape',
      description: "this isn't a real module, just a test one",
      filePath: undefined,
      id: 'bar',
    },
  ]

  const actual = getModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id')
  t.end()
})
