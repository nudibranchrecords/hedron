import { call, select, takeEvery, put } from 'redux-saga/effects'
import { save, load } from '../../utils/file'
import { getProjectData, getProjectFilepath } from './selectors'
import { projectLoadSuccess, projectSketchesPathUpdate } from './actions'
import { sketchesReplaceAll } from '../sketches/actions'
import { nodesReplaceAll } from '../nodes/actions'
import { inputsReplaceAll } from '../inputs/actions'
import { inputLinksReplaceAll } from '../inputLinks/actions'
import { macrosReplaceAll } from '../macros/actions'
export function* saveProject () {
  const data = yield select(getProjectData)
  const filepath = yield select(getProjectFilepath)
  yield call(save, filepath, data)
}

export function* loadProject () {
  const filepath = yield select(getProjectFilepath)
  const projectData = yield call(load, filepath)
  yield put(projectSketchesPathUpdate(projectData.project.sketchesPath))
  yield put(sketchesReplaceAll(projectData.sketches))
  yield put(nodesReplaceAll(projectData.nodes))
  yield put(inputsReplaceAll(projectData.inputs))
  yield put(inputLinksReplaceAll(projectData.inputLinks))
  yield put(macrosReplaceAll(projectData.macros))
  yield put(projectLoadSuccess(projectData))
}

export function* watchProject () {
  yield takeEvery('PROJECT_SAVE', saveProject)
  yield takeEvery('PROJECT_LOAD_REQUEST', loadProject)
}
