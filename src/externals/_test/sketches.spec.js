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
const fsStub = {}
fsStub.existsSync = (path) => (true)
fsStub.statSync = (path) => ({ isDirectory:true })

const { loadSketches } = proxyquire('../sketches', {
  glob: {
    // Mocked up sketch files
    sync: syncStub,
  },
  fs: fsStub,
  // Mocked up modules and meta (just returning strings for test)
  [path.resolve('foo/bar/dog/index.js')]: 'dogModule',
  [path.resolve('foo/bar/cat/index.js')]: 'catModule',
  [path.resolve('foo/bar/frog/index.js')]: 'frogModule',
  [path.resolve('foo/bar/dog/config.js')]: { name:'dogMeta', filePathArray:[] },
  [path.resolve('foo/bar/cat/config.js')]: { name:'catMeta', filePathArray:[] },
  [path.resolve('foo/bar/frog/config.js')]: { name:'frogMeta', filePathArray:[] },

  // /bar/bar/cat does not have a config file
  [path.resolve('bar/bar/dog/index.js')]: 'dogModule',
  [path.resolve('bar/bar/cat/index.js')]: 'catModule',
  [path.resolve('bar/bar/dog/config.js')]: { name:'dogMeta', filePathArray:[] },

  // does not have index file
  [path.resolve('wee/bar/dog/config.js')]: { name:'dogMeta', filePathArray:[] },

})

test('(External) sketches - loadSketches()', (t) => {
  const expected = {
    dog: {
      Module: 'dogModule',
      config: { name:'dogMeta', filePathArray:[] },
    },
    cat: {
      Module: 'catModule',
      config: { name:'catMeta', filePathArray:[] },
    },
    frog: {
      Module: 'frogModule',
      config: { name:'frogMeta', filePathArray:[] },
    },
  }
  const actual = loadSketches('foo/bar')
  t.deepEqual(actual, expected, 'Returns modules from files')
  t.end()
})

test('(External) sketches - loadSketches() - one module does not have config', (t) => {
  t.throws(() => {
    loadSketches('bar/bar')
  })
  t.end()
})

test('(External) sketches - loadSketches() - one module does not have index', (t) => {
  t.throws(() => {
    loadSketches('wee/bar')
  })
  t.end()
})

test('(External) sketches - loadSketches() - folder doesnt exist', (t) => {
  t.throws(() => {
    loadSketches('foo/@@@@')
  })
  t.end()
})
