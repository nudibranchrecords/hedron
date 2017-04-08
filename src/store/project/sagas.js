import { call, select, takeEvery } from 'redux-saga/effects'
import { save } from '../../utils/file'
import { getProjectData, getProjectFilepath } from './selectors'

export function* saveProject () {
  const data = yield select(getProjectData)
  const filepath = yield select(getProjectFilepath)
  yield call(save, filepath, data)
}

export function* watchProject () {
  yield takeEvery('PROJECT_SAVE', saveProject)
}

