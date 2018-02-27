import { apply, select, takeEvery, put } from 'redux-saga/effects'
import engine from './'
import { getAllSketches } from './selectors'
import getSketchesPath from '../selectors/getSketchesPath'
import { projectError } from '../store/project/actions'

export function* handleAddSketch (action) {
  const id = action.payload.id
  const moduleId = action.payload.sketch.moduleId
  yield apply(engine, engine.addSketch, [id, moduleId])
}

export function* handleRemoveSketch (action) {
  yield apply(engine, engine.removeSketch, [action.payload.id])
}

export function* handleInitiateSketches () {
  try {
    const sketchesPath = yield select(getSketchesPath)
    const allSketches = yield select(getAllSketches)
    yield apply(engine, engine.loadSketchModules, [sketchesPath])
    yield apply(engine, engine.initiateSketches, [allSketches])
  } catch (error) {
    console.log(error)
    yield put(projectError(`Failed to initiate sketches: ${error.message}`))
  }
}

export function* handleShotFired (action) {
  yield apply(engine, engine.fireShot, [action.payload.sketchId, action.payload.method])
}

export function* watchSketches () {
  yield takeEvery('SKETCH_CREATE', handleAddSketch)
  yield takeEvery('SKETCH_DELETE', handleRemoveSketch)
  yield takeEvery('PROJECT_LOAD_SUCCESS', handleInitiateSketches)
  yield takeEvery('NODE_SHOT_FIRED', handleShotFired)
}
