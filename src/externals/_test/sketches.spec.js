import proxyquire from 'proxyquire'
import test from 'tape'
import path from 'path'

proxyquire.noCallThru()

const sketches = proxyquire('../sketches', {
  glob: {
    sync: () => ['foo/bar/dog', 'foo/bar/cat', 'foo/bar/frog']
  },
  [path.resolve('foo/bar/dog')]: 'doggy',
  [path.resolve('foo/bar/cat')]: 'catty',
  [path.resolve('foo/bar/frog')]: 'froggy'
})

test('(External) sketches', (t) => {
  t.plan(1)
  const expected = {
    dog: 'doggy',
    cat: 'catty',
    frog: 'froggy'
  }
  const actual = sketches
  t.deepEqual(actual, expected, 'Returns modules from files')
})
