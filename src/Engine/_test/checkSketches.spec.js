import test from 'tape'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

proxyquire.noCallThru()

function DogModule () { this.root = 'dog' }
function CatModule () { this.root = 'cat' }
function FrogModule () { this.root = 'frog' }

const spies = {
  worldAdd: sinon.spy(),
  worldRemove: sinon.spy()
}

const checkSketches = proxyquire('../checkSketches', {
  sketches: {
    dog: {
      Module: DogModule,
      params: 'dogMeta'
    },
    cat: {
      Module: CatModule,
      params: 'catMeta'
    },
    frog: {
      Module: FrogModule,
      params: 'frogMeta'
    }
  },
  './world': {
    scene: {
      add: spies.worldAdd,
      remove: spies.worldRemove
    }
  }
}).default

test('(Engine) checkSketches', (t) => {
  let state, sketches, expectedSketches, actual

  sketches = []

  state = {
    sketches: {
      instances: {
        foo: {
          moduleId: 'dog'
        }
      }
    }
  }

  expectedSketches = [
    {
      id: 'foo',
      module: new DogModule()
    }
  ]

  actual = checkSketches(sketches, state)
  t.deepEqual(actual, expectedSketches, 'Adds Sketch when there is extra in state (from empty)')

  t.equal(spies.worldAdd.calledWith('dog'), true, 'Adds module root to world')

  state = {
    sketches: {
      instances: {
        foo: {
          moduleId: 'dog'
        },
        bar: {
          moduleId: 'cat'
        }
      }
    }
  }

  expectedSketches = [
    {
      id: 'foo',
      module: new DogModule()
    },
    {
      id: 'bar',
      module: new CatModule()
    }
  ]

  actual = checkSketches(sketches, state)
  t.deepEqual(actual, expectedSketches, 'Adds Sketch when there is extra in state')
  t.equal(spies.worldAdd.calledWith('cat'), true, 'Adds module root to world')

  state = {
    sketches: {
      instances: {
        bar: {
          moduleId: 'cat'
        }
      }
    }
  }

  expectedSketches = [
    {
      id: 'bar',
      module: new CatModule()
    }
  ]

  actual = checkSketches(sketches, state)
  t.deepEqual(actual, expectedSketches, 'Removes Sketch when there is one less in state')
  t.equal(spies.worldRemove.calledWith('dog'), true, 'Adds module root to world')

  state = {
    sketches: {
      instances: {}
    }
  }

  expectedSketches = []

  actual = checkSketches(sketches, state)
  t.deepEqual(actual, expectedSketches, 'Removes Sketch when there is one less in state')
  t.equal(spies.worldRemove.calledWith('cat'), true, 'Adds module root to world')

  t.end()
})
