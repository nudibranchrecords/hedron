import { call, select, takeEvery, put } from 'redux-saga/effects'
import { save, load } from '../../utils/file'
import { getProjectData, getProjectFilepath } from './selectors'
import { projectLoadSuccess } from './actions'
import { sketchesReplaceAll } from '../sketches/actions'
import { paramsReplaceAll } from '../params/actions'
import { inputsReplaceAll } from '../inputs/actions'

export function* saveProject () {
  const data = yield select(getProjectData)
  const filepath = yield select(getProjectFilepath)
  yield call(save, filepath, data)
}

export function* loadProject () {
  const filepath = yield select(getProjectFilepath)
  const projectData = yield call(load, filepath)
  yield put(sketchesReplaceAll(projectData.sketches))
  yield put(paramsReplaceAll(projectData.params))
  yield put(projectLoadSuccess(projectData))
}

export function* watchProject () {
  yield takeEvery('PROJECT_SAVE', saveProject)
  yield takeEvery('PROJECT_LOAD_REQUEST', loadProject)
}

