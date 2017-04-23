import proxyquire from 'proxyquire'
import test from 'tape'
import path from 'path'

proxyquire.noCallThru()

const mockFunction = (control, value) => control * value

const modifiers = proxyquire('../modifiers', {
  glob: {
    // Mocked up sketch files
    sync: () => ['foo/bar/dog', 'foo/bar/cat', 'foo/bar/frog']
  },
  // Mocked up modules and meta (just returning strings for test)
  [path.resolve('foo/bar/dog')]: mockFunction,
  [path.resolve('foo/bar/cat')]: 'catModule',
  [path.resolve('foo/bar/frog')]: 'frogModule',
  [path.resolve('foo/bar/dog/config.js')]: 'dogMeta',
  [path.resolve('foo/bar/cat/config.js')]: 'catMeta',
  [path.resolve('foo/bar/frog/config.js')]: 'frogMeta'
})

test('(External) modifiers - getAll()', (t) => {
  t.plan(1)
  const expected = {
    dog: {
      func: mockFunction,
      config: 'dogMeta'
    },
    cat: {
      func: 'catModule',
      config: 'catMeta'
    },
    frog: {
      func: 'frogModule',
      config: 'frogMeta'
    }
  }
  const actual = modifiers.getAll()
  t.deepEqual(actual, expected, 'Returns functions from files')
})

test('(External) modifiers - work()', (t) => {
  t.plan(1)
  const actual = modifiers.work('dog', 2, 3)
  t.equal(actual, 6, 'Calls function')
})
