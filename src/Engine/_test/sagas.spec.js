import 'babel-polyfill'
import test from 'tape'
import { apply, select, takeEvery } from 'redux-saga/effects'
import proxyquire from 'proxyquire'
import { getNewestSketchId, getAllSketches } from '../selectors'

proxyquire.noCallThru()

const engine = proxyquire('../index', {
  'sketches' : {}
}).default

const { watchSketches, handleAddSketch, handleRemoveSketch, handleInitiateSketches } = proxyquire('../sagas', {
  'sketches' : []
})

test('(Saga) watchSketches', (t) => {
  const generator = watchSketches()
  t.deepEqual(
    generator.next().value,
    takeEvery('SKETCHES_INSTANCE_CREATE', handleAddSketch),
    'SKETCHES_INSTANCE_CREATE'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('SKETCHES_INSTANCE_DELETE', handleRemoveSketch),
    'SKETCHES_INSTANCE_DELETE'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_LOAD_SUCCESS', handleInitiateSketches),
    'PROJECT_LOAD_SUCCESS'
  )
  t.end()
})

test('(Saga) handleAddSketch', (t) => {
  const generator = handleAddSketch({
    payload: {
      moduleId: 'cubey'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getNewestSketchId),
    '1. Get newest sketch id'
  )

  const sketchId = 'XXX'

  t.deepEqual(
    generator.next(sketchId).value,
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
    select(getAllSketches),
    '1. Get all sketches from state'
  )

  const sketches = { foo: 'bar' }

  t.deepEqual(
    generator.next(sketches).value,
     apply(engine, engine.initiateSketches, [sketches]),
    '2. Initiate them'
  )

  t.end()
})
