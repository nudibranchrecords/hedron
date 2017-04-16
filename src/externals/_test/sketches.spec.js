import proxyquire from 'proxyquire'
import test from 'tape'
import path from 'path'

proxyquire.noCallThru()

const sketches = proxyquire('../sketches', {
  glob: {
    // Mocked up sketch files
    sync: () => ['foo/bar/dog', 'foo/bar/cat', 'foo/bar/frog']
  },
  // Mocked up modules and meta (just returning strings for test)
  [path.resolve('foo/bar/dog')]: 'dogModule',
  [path.resolve('foo/bar/cat')]: 'catModule',
  [path.resolve('foo/bar/frog')]: 'frogModule',
  [path.resolve('foo/bar/dog/config.js')]: 'dogMeta',
  [path.resolve('foo/bar/cat/config.js')]: 'catMeta',
  [path.resolve('foo/bar/frog/config.js')]: 'frogMeta'
})

test('(External) sketches', (t) => {
  t.plan(1)
  const expected = {
    dog: {
      Module: 'dogModule',
      config: 'dogMeta'
    },
    cat: {
      Module: 'catModule',
      config: 'catMeta'
    },
    frog: {
      Module: 'frogModule',
      config: 'frogMeta'
    }
  }
  const actual = sketches
  t.deepEqual(actual, expected, 'Returns modules from files')
})
