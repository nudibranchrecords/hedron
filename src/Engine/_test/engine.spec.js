import test from 'tape'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

proxyquire.noCallThru()

function DogModule () { this.root = 'dogRoot' }
function CatModule () { this.root = 'catRoot' }
function FrogModule () { this.root = 'frogRoot' }

const spies = {
  worldAdd: sinon.spy(),
  worldRemove: sinon.spy()
}

test('Engine', (t) => {
  let expected, sketches

  const engine = proxyquire('../', {
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

  t.deepEqual(engine.sketches, [], 'Sketches start empty')

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

  let sketches1 = [
    {
      id: 'AAA',
      moduleId: 'cat'
    },
    {
      id: 'BBB',
      moduleId: 'frog'
    },
    {
      id: 'CCC',
      moduleId: 'cat'
    },
    {
      id: 'DDD',
      moduleId: 'dog'
    }
  ]

  engine.initiateSketches(sketches1)

  t.equal(spies.worldAdd.callCount, 6, 'Adds 4 extra roots to world')
  t.deepEqual(engine.sketches, expected, 'Adds multiple sketches')

  for (let i = 2; i < 6; i++) {
    const spyCall = spies.worldAdd.getCall(i)
    t.equal(spyCall.args[0], sketches1[i - 2].moduleId + 'Root', 'Adds correct root')
  }

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

  let sketches2 = [
    {
      id: '111',
      moduleId: 'frog'
    },
    {
      id: '222',
      moduleId: 'frog'
    },
    {
      id: '333',
      moduleId: 'cat'
    }
  ]

  engine.initiateSketches(sketches2)

  t.equal(spies.worldRemove.callCount, 6, 'Removes 4 roots from world')
  t.equal(spies.worldAdd.callCount, 9, 'Adds 3 extra roots to world')
  t.deepEqual(engine.sketches, expected, 'Adds multiple sketches')

  for (let i = 6; i < 9; i++) {
    const spyCall = spies.worldAdd.getCall(i)
    t.equal(spyCall.args[0], sketches2[i - 6].moduleId + 'Root', 'Adds correct root')
  }

  for (let i = 2; i < 5; i++) {
    const spyCall = spies.worldRemove.getCall(i)
    t.equal(spyCall.args[0], sketches1[i - 2].moduleId + 'Root', 'Removes correct root')
  }

  t.end()
})
