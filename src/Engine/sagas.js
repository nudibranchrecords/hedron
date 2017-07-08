import { apply, select, takeEvery } from 'redux-saga/effects'
import engine from './'
import { getAllSketches } from './selectors'

export function* handleAddSketch (action) {
  const id = action.payload.id
  const moduleId = action.payload.sketch.moduleId
  yield apply(engine, engine.addSketch, [id, moduleId])
}

export function* handleRemoveSketch (action) {
  yield apply(engine, engine.removeSketch, [action.payload.id])
}

export function* handleInitiateSketches () {
  const allSketches = yield select(getAllSketches)
  yield apply(engine, engine.initiateSketches, [allSketches])
}

export function* handleShotFired (action) {
  yield apply(engine, engine.fireShot, [action.payload.sketchId, action.payload.method])
}

export function* watchSketches () {
  yield takeEvery('SKETCH_CREATE', handleAddSketch)
  yield takeEvery('SKETCH_DELETE', handleRemoveSketch)
  yield takeEvery('PROJECT_LOAD_SUCCESS', handleInitiateSketches)
  yield takeEvery('INPUT_LINK_SHOT_FIRED', handleShotFired)
}
