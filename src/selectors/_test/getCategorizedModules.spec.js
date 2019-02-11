import test from 'tape'
import getCategorizedModules from '../getCategorizedModules'

test('(Selector) getCategorizedModules - no categories', (t) => {
  const state = {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        somethingElse: 'thing',
      },
      bar: {
        defaultTitle: 'Bar',
      },
    },
  }

  const expected = {
    looseItems: [
      {
        id: 'foo',
        title: 'Foo',
        defaultTitle: 'Foo',
        somethingElse: 'thing',
      },
      {
        id: 'bar',
        title: 'Bar',
        defaultTitle: 'Bar',
      },
    ],
    categorizedItems: [],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, inside "looseItems"')
  t.end()
})

test('(Selector) getCategorizedModules - all categories', (t) => {
  const state = {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        somethingElse: 'thing',
        category: 'cat1',
      },
      bar: {
        defaultTitle: 'Bar',
        category: 'cat2',
      },
      lorem: {
        defaultTitle: 'Lorem',
        category: 'cat1',
      },
    },
  }

  const expected = {
    looseItems: [],
    categorizedItems: [
      {
        id: 'cat1',
        title: 'cat1',
        items: [
          {
            id: 'foo',
            title: 'Foo',
            defaultTitle: 'Foo',
            somethingElse: 'thing',
            category: 'cat1',
          },
          {
            id: 'lorem',
            title: 'Lorem',
            defaultTitle: 'Lorem',
            category: 'cat1',
          },
        ],
      },
      {
        id: 'cat2',
        title: 'cat2',
        items: [
          {
            id: 'bar',
            title: 'Bar',
            defaultTitle: 'Bar',
            category: 'cat2',
          },
        ],
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, inside "looseItems"')
  t.end()
})

test('(Selector) getCategorizedModules - loose and categories', (t) => {
  const state = {
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        somethingElse: 'thing',
        category: 'cat1',
      },
      bar: {
        defaultTitle: 'Bar',
        category: 'cat2',
      },
      lorem: {
        defaultTitle: 'Lorem',
      },
    },
  }

  const expected = {
    looseItems: [
      {
        id: 'lorem',
        title: 'Lorem',
        defaultTitle: 'Lorem',
      },
    ],
    categorizedItems: [
      {
        id: 'cat1',
        title: 'cat1',
        items: [
          {
            id: 'foo',
            title: 'Foo',
            defaultTitle: 'Foo',
            somethingElse: 'thing',
            category: 'cat1',
          },
        ],
      },
      {
        id: 'cat2',
        title: 'cat2',
        items: [
          {
            id: 'bar',
            title: 'Bar',
            defaultTitle: 'Bar',
            category: 'cat2',
          },
        ],
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, inside "looseItems"')
  t.end()
})
