import proxyquire from 'proxyquire'
import test from 'tape'
import path from 'path'
import sinon from 'sinon'

proxyquire.noCallThru()

const syncStub = sinon.stub()

syncStub.returns([])
syncStub.withArgs('foo/bar/*').returns(['foo/bar/dog', 'foo/bar/cat', 'foo/bar/frog'])
syncStub.withArgs('bar/bar/*').returns(['bar/bar/dog', 'bar/bar/cat'])
syncStub.withArgs('wee/bar/*').returns(['wee/bar/dog'])

const { getSketches } = proxyquire('../sketches', {
  glob: {
    // Mocked up sketch files
    sync: syncStub
  },
  // Mocked up modules and meta (just returning strings for test)
  [path.resolve('foo/bar/dog/index.js')]: 'dogModule',
  [path.resolve('foo/bar/cat/index.js')]: 'catModule',
  [path.resolve('foo/bar/frog/index.js')]: 'frogModule',
  [path.resolve('foo/bar/dog/config.js')]: 'dogMeta',
  [path.resolve('foo/bar/cat/config.js')]: 'catMeta',
  [path.resolve('foo/bar/frog/config.js')]: 'frogMeta',

  // /bar/bar/cat does not have a config file
  [path.resolve('bar/bar/dog/index.js')]: 'dogModule',
  [path.resolve('bar/bar/cat/index.js')]: 'catModule',
  [path.resolve('bar/bar/dog/config.js')]: 'dogMeta',

  // does not have index file
  [path.resolve('wee/bar/dog/config.js')]: 'dogMeta'

})

test('(External) sketches - getSketches()', (t) => {
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
  const actual = getSketches('foo/bar')
  t.deepEqual(actual, expected, 'Returns modules from files')
  t.end()
})

test('(External) sketches - getSketches() - one module does not have config', (t) => {
  t.throws(() => {
    getSketches('bar/bar')
  })
  t.end()
})

test('(External) sketches - getSketches() - one module does not have index', (t) => {
  t.throws(() => {
    getSketches('wee/bar')
  })
  t.end()
})

test('(External) sketches - getSketches() - folder doesnt exist', (t) => {
  t.throws(() => {
    getSketches('foo/@@@@')
  })
  t.end()
})
