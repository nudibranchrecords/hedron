import { apply, select, takeEvery, put } from 'redux-saga/effects'
import engine from './'
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

export function* handleInitiateScenes () {
  try {
    const sketchesPath = yield select(getSketchesPath)
    yield apply(engine, engine.loadSketchModules, [sketchesPath])
    yield apply(engine, engine.initiateScenes)
  } catch (error) {
    console.log(error)
    yield put(projectError(`Failed to initiate sketches: ${error.message}`))
  }
}

export function* handleShotFired (action) {
  yield apply(engine, engine.fireShot, [action.payload.sketchId, action.payload.method])
}

export function* watchEngine () {
  yield takeEvery('SKETCH_CREATE', handleAddSketch)
  yield takeEvery('SKETCH_DELETE', handleRemoveSketch)
  yield takeEvery('PROJECT_LOAD_SUCCESS', handleInitiateScenes)
  yield takeEvery('NODE_SHOT_FIRED', handleShotFired)
}
