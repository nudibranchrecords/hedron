import test from 'tape'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

function DogModule () { this.thing = 'dog' }
function CatModule () { this.thing = 'cat' }
function FrogModule () { this.thing = 'frog' }

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

  state = {
    sketches: {
      instances: {}
    }
  }

  expectedSketches = []

  actual = checkSketches(sketches, state)
  t.deepEqual(actual, expectedSketches, 'Removes Sketch when there is one less in state')

  t.end()
})
