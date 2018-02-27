import 'babel-polyfill'
import test from 'tape'
import { apply, select, takeEvery, put } from 'redux-saga/effects'
import proxyquire from 'proxyquire'
import { getAllSketches } from '../selectors'
import getSketchesPath from '../../selectors/getSketchesPath'
import { projectError } from '../../store/project/actions'

proxyquire.noCallThru()

const engine = proxyquire('../index', {
  'sketches': {}
}).default

const {
  watchSketches, handleAddSketch, handleRemoveSketch,
  handleInitiateSketches, handleShotFired
} = proxyquire('../sagas', {
  'sketches': []
})

test('(Saga) watchSketches', (t) => {
  const generator = watchSketches()
  t.deepEqual(
    generator.next().value,
    takeEvery('SKETCH_CREATE', handleAddSketch),
    'SKETCHES_INSTANCE_CREATE'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('SKETCH_DELETE', handleRemoveSketch),
    'SKETCHES_INSTANCE_DELETE'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_LOAD_SUCCESS', handleInitiateSketches),
    'PROJECT_LOAD_SUCCESS'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('NODE_SHOT_FIRED', handleShotFired),
    'NODE_SHOT_FIRED'
  )
  t.end()
})

test('(Saga) handleAddSketch', (t) => {
  const generator = handleAddSketch({
    payload: {
      id: 'XXX',
      sketch: {
        moduleId: 'cubey'
      }
    }
  })

  t.deepEqual(
    generator.next().value,
    apply(engine, engine.addSketch, ['XXX', 'cubey']),
    '2. Add sketch'
  )

  t.end()
})

test('(Saga) handleRemoveSketch', (t) => {
  const generator = handleRemoveSketch({
    payload: {
      id: 'XXX'
    }
  })

  t.deepEqual(
    generator.next().value,
    apply(engine, engine.removeSketch, ['XXX']),
    '1. Remove sketch'
  )

  t.end()
})

test('(Saga) handleInitiateSketches', (t) => {
  const generator = handleInitiateSketches()

  t.deepEqual(
    generator.next().value,
    select(getSketchesPath),
    '0. Get sketches path from state'
  )

  const path = 'foo/bar'

  t.deepEqual(
    generator.next(path).value,
    select(getAllSketches),
    '1. Get all sketches from state'
  )

  const sketches = { foo: 'bar' }

  t.deepEqual(
    generator.next(sketches).value,
     apply(engine, engine.loadSketchModules, [path]),
    '2. Load in modules'
  )

  t.deepEqual(
    generator.next().value,
     apply(engine, engine.initiateSketches, [sketches]),
    '3. Initiate sketches'
  )

  t.end()
})

test('(Saga) handleInitiateSketches - error', (t) => {
  const generator = handleInitiateSketches()
  generator.next()

  t.deepEqual(
    generator.throw(Error('omg!')).value,
      put(projectError(`Failed to initiate sketches: omg!`)),
    '0. Dispatch project error on error'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleShotFired', (t) => {
  const generator = handleShotFired({
    payload: {
      sketchId: 'XXX',
      method: 'meow'
    }
  })

  t.deepEqual(
    generator.next().value,
    apply(engine, engine.fireShot, ['XXX', 'meow']),
    '1. Fires shot'
  )

  t.end()
})
