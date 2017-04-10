import { apply, select, takeEvery } from 'redux-saga/effects'
import engine from './'
import { getNewestSketchId } from './selectors'

export function* handleAddSketch (action) {
  const id = yield select(getNewestSketchId)
  const moduleId = action.payload.moduleId
  yield apply(engine, engine.addSketch, [id, moduleId])
}

export function* handleRemoveSketch (action) {
  yield apply(engine, engine.removeSketch, [action.payload.id])
}

export function* handleInitiateSketches () {
}

export function* watchSketches () {
  yield takeEvery('SKETCHES_INSTANCE_CREATE', handleAddSketch)
  yield takeEvery('SKETCHES_INSTANCE_DELETE', handleRemoveSketch)
  yield takeEvery('SKETCHES_INSTANCES_INITIATE', handleInitiateSketches)
}
