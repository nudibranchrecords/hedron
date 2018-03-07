import 'jsdom-global/register' // Fixes issue with window var in node
import test from 'tape'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

proxyquire.noCallThru()

const spies = {
  worldAdd: sinon.spy(),
  worldRemove: sinon.spy(),
  meow: sinon.spy()
}

function DogModule () {
  this.root = 'dogRoot'
}

function CatModule () {
  this.root = 'catRoot'
  this.meow = spies.meow
}

const getSketchesStub = sinon.stub()
getSketchesStub.withArgs('foo/bar').returns(
  {
    dog: {
      Module: DogModule,
      config: 'dogMeta'
    },
    cat: {
      Module: CatModule,
      config: 'catMeta'
    },
    frog: {
      Module: FrogModule,
      config: 'frogMeta'
    }
  }
)

function FrogModule () { this.root = 'frogRoot' }

test('engine', (t) => {
  let expected

  const engine = proxyquire('../', {
    '../externals/sketches': {
      getSketches: getSketchesStub
    },
    './world': {
      scene: {
        add: spies.worldAdd,
        remove: spies.worldRemove
      }
    }
  }).default

  t.deepEqual(engine.allModules, {}, 'If no dev config, no sketch modules are loaded')
  t.deepEqual(engine.sketches, [], 'Sketches start empty')

  engine.loadSketchModules('foo/bar')

  engine.addSketch('XXX', 'dog')

  expected = [
    {
      id: 'XXX',
      module: new DogModule()
    }
  ]

  t.equal(spies.worldAdd.calledWith('dogRoot'), true, 'Adds module root to world')
  t.deepEqual(engine.sketches, expected, 'Adds sketch')

  expected = [
    {
      id: 'XXX',
      module: new DogModule()
    },
    {
      id: 'YYY',
      module: new CatModule()
    }
  ]

  engine.addSketch('YYY', 'cat')

  t.equal(spies.worldAdd.calledWith('catRoot'), true, 'Adds module root to world')
  t.deepEqual(engine.sketches, expected, 'Adds sketch')

  expected = [
    {
      id: 'YYY',
      module: new CatModule()
    }
  ]

  engine.removeSketch('XXX', 'dog')

  t.equal(spies.worldRemove.calledWith('dogRoot'), true, 'Removes module root from world')
  t.deepEqual(engine.sketches, expected, 'Removes sketch')

  engine.removeSketch('YYY', 'cat')

  t.equal(spies.worldRemove.calledWith('catRoot'), true, 'Removes module root from world')
  t.deepEqual(engine.sketches, [], 'Removes sketch')

  expected = [
    {
      id: 'AAA',
      module: new CatModule()
    },
    {
      id: 'BBB',
      module: new FrogModule()
    },
    {
      id: 'CCC',
      module: new CatModule()
    },
    {
      id: 'DDD',
      module: new DogModule()
    }
  ]

  let sketches1 = {
    'AAA': {
      moduleId: 'cat'
    },
    'BBB': {
      moduleId: 'frog'
    },
    'CCC': {
      moduleId: 'cat'
    },
    'DDD': {
      moduleId: 'dog'
    }
  }

  engine.initiateSketches(sketches1)

  t.equal(spies.worldAdd.callCount, 6, 'Adds 4 extra roots to world')
  t.deepEqual(engine.sketches, expected, 'Adds multiple sketches')

  Object.keys(sketches1).forEach((sketchId, index) => {
    const spyCall = spies.worldAdd.getCall(index + 2)
    t.equal(spyCall.args[0], sketches1[sketchId].moduleId + 'Root', 'Adds correct root')
  })

  expected = [
    {
      id: '111',
      module: new FrogModule()
    },
    {
      id: '222',
      module: new FrogModule()
    },
    {
      id: '333',
      module: new CatModule()
    }
  ]

  let sketches2 = {
    '111': {
      moduleId: 'frog'
    },
    '222': {
      moduleId: 'frog'
    },
    '333': {
      moduleId: 'cat'
    }
  }

  engine.initiateSketches(sketches2)

  t.equal(spies.worldRemove.callCount, 6, 'Removes 4 roots from world')
  t.equal(spies.worldAdd.callCount, 9, 'Adds 3 extra roots to world')
  t.deepEqual(engine.sketches, expected, 'Adds multiple sketches')

  Object.keys(sketches2).forEach((sketchId, index) => {
    const spyCall = spies.worldAdd.getCall(index + 6)
    t.equal(spyCall.args[0], sketches2[sketchId].moduleId + 'Root', 'Adds correct root')
  })

  Object.keys(sketches1).forEach((sketchId, index) => {
    const spyCall = spies.worldRemove.getCall(index + 2)
    t.equal(spyCall.args[0], sketches1[sketchId].moduleId + 'Root', 'Adds correct root')
  })

  t.end()
})
