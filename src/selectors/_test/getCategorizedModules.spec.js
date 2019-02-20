import test from 'tape'
import getCategorizedModules from '../getCategorizedModules'

test('(Selector) getCategorizedModules - no categories', (t) => {
  const state = {
    nodes:{
      sketchOrganization:{ value:'category' },
    },
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
    categorizedItems: [{
      id: 'root',
      title: 'root',
      items: [],
      categories:[] }],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, inside "looseItems"')
  t.end()
})

test('(Selector) getCategorizedModules - all categories', (t) => {
  const state = {
    nodes:{
      sketchOrganization:{ value:'category' },
    },
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
        id: 'root',
        title: 'root',
        items: [],
        categories:
        [
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
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, inside "categorizedItems"')
  t.end()
})

test('(Selector) getCategorizedModules - loose and categories', (t) => {
  const state = {
    nodes:{
      sketchOrganization:{ value:'category' },
    },
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
        id: 'root',
        title: 'root',
        items: [],
        categories:
        [
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
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected,
    'Returns array of modules with title and id, inside "looseItems" and "categorizedItems"')
  t.end()
})

test('(Selector) getCategorizedModules - loose and authors', (t) => {
  const state = {
    nodes:{
      sketchOrganization:{ value:'author' },
    },
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        somethingElse: 'thing',
        author: 'auth1',
      },
      bar: {
        defaultTitle: 'Bar',
        author: 'auth2',
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
        id: 'root',
        title: 'root',
        items: [],
        categories:
        [
          {
            id: 'auth1',
            title: 'auth1',
            items: [
              {
                id: 'foo',
                title: 'Foo',
                defaultTitle: 'Foo',
                somethingElse: 'thing',
                author: 'auth1',
              },
            ],
          },
          {
            id: 'auth2',
            title: 'auth2',
            items: [
              {
                id: 'bar',
                title: 'Bar',
                defaultTitle: 'Bar',
                author: 'auth2',
              },
            ],
          },
        ],
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, with categories based on author')
  t.end()
})

test('(Selector) getCategorizedModules - loose and folders', (t) => {
  const state = {
    nodes:{
      sketchOrganization:{ value:'folder' },
    },
    availableModules: {
      foo: {
        defaultTitle: 'Foo',
        somethingElse: 'thing',
        filePathArray: ['foo'],
      },
      bar: {
        defaultTitle: 'Bar',
        filePathArray: ['bar'],
      },
      sub: {
        defaultTitle: 'Sub',
        filePathArray: ['bar', 'sub'],
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
        id: 'root',
        title: 'root',
        items: [],
        categories:
        [
          {
            id: 'foo',
            title: 'foo',
            items: [
              {
                id: 'foo',
                title: 'Foo',
                defaultTitle: 'Foo',
                somethingElse: 'thing',
                filePathArray: ['foo'],
              },
            ],
            categories:[],
          },
          {
            id: 'bar',
            title: 'bar',
            items: [
              {
                id: 'bar',
                title: 'Bar',
                defaultTitle: 'Bar',
                filePathArray: ['bar'],
              },
            ],
            categories:[
              {
                id: 'sub',
                title:'sub',
                items:[
                  {
                    id: 'sub',
                    title: 'Sub',
                    defaultTitle: 'Sub',
                    filePathArray: ['bar', 'sub'],
                  },
                ],
                categories:[],
              },
            ],
          },
        ],
      },
    ],
  }

  const actual = getCategorizedModules(state)

  t.deepEqual(actual, expected, 'Returns array of modules with title and id, with categories based on filePathArray')
  t.end()
})
