import { call, select, takeEvery, put } from 'redux-saga/effects'
import { save, load } from '../../utils/file'
import { getProjectData, getProjectFilepath } from './selectors'
import { projectLoadSuccess, projectRehydrate, projectError } from './actions'
import history from '../../history'

export function* saveProject () {
  try {
    const data = yield select(getProjectData)
    const filepath = yield select(getProjectFilepath)
    yield call(save, filepath, data)
  } catch (error) {
    console.error(error)
    yield put(projectError(`Failed to save file: ${error.message}`))
  }
}

export function* loadProject () {
  try {
    const filepath = yield select(getProjectFilepath)
    const projectData = yield call(load, filepath)
    yield put(projectRehydrate(projectData))
    yield put(projectLoadSuccess(projectData))
    yield call([history, history.replace], projectData.router.location.pathname)
  } catch (error) {
    console.error(error)
    yield put(projectError(`Failed to load file: ${error.message}`))
  }
}

export function* watchProject () {
  yield takeEvery('PROJECT_SAVE', saveProject)
  yield takeEvery('PROJECT_LOAD_REQUEST', loadProject)
}
