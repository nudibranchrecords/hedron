import proxyquire from 'proxyquire'
import test from 'tape'
import path from 'path'
import sinon from 'sinon'

proxyquire.noCallThru()

const globStub = {
  sync: sinon.stub(),
}
const fsStub = {
  existsSync: sinon.stub(),
  statSync: sinon.stub(),
}

const purgeSpy = sinon.spy()

globStub.sync.returns([])
globStub.sync.withArgs('foo/bar/*').returns(['foo/bar/dog', 'foo/bar/cat', 'foo/bar/amphibians'])
globStub.sync.withArgs('foo/bar/amphibians/*').returns(['foo/bar/amphibians/frog'])
globStub.sync.withArgs('bar/bar/*').returns(['bar/bar/dog', 'bar/bar/cat'])
globStub.sync.withArgs('wee/bar/*').returns(['wee/bar/dog'])

fsStub.statSync.returns({ isDirectory: true })

fsStub.existsSync.returns(true)
fsStub.existsSync.withArgs(path.resolve('foo/bar/amphibians/index.js')).returns(false)
fsStub.existsSync.withArgs(path.resolve('foo/bar/amphibians/config.js')).returns(false)

const { loadSketches } = proxyquire('../sketches', {
  glob: globStub,
  fs: fsStub,
  './purgeRequireCache': purgeSpy,
  // Mocked up modules and meta (just returning strings for test)
  [path.resolve('foo/bar/dog/index.js')]: 'dogModule',
  [path.resolve('foo/bar/cat/index.js')]: 'catModule',
  [path.resolve('foo/bar/amphibians/frog/index.js')]: 'frogModule',

  [path.resolve('foo/bar/dog/config.js')]: { name:'dogMeta' },
  [path.resolve('foo/bar/cat/config.js')]: { name:'catMeta' },
  [path.resolve('foo/bar/amphibians/frog/config.js')]: { name:'frogMeta' },

  // /bar/bar/cat does not have a config file
  [path.resolve('bar/bar/dog/index.js')]: 'dogModule',
  [path.resolve('bar/bar/cat/index.js')]: 'catModule',
  [path.resolve('bar/bar/dog/config.js')]: { name:'dogMeta' },

  // does not have index file
  [path.resolve('wee/bar/dog/config.js')]: { name:'dogMeta' },

})

test('(External) sketches - loadSketches()', (t) => {
  const expected = {
    dog: {
      Module: 'dogModule',
      config: { name:'dogMeta', filePathArray:[], filePath: 'foo/bar/dog' },
    },
    cat: {
      Module: 'catModule',
      config: { name:'catMeta', filePathArray:[], filePath: 'foo/bar/cat' },
    },
    frog: {
      Module: 'frogModule',
      config: { name:'frogMeta', filePathArray:['amphibians'], filePath: 'foo/bar/amphibians/frog' },
    },
  }
  const actual = loadSketches('foo/bar')
  t.isEqual(purgeSpy.called, true)
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
