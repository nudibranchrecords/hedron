import { call, select, takeEvery } from 'redux-saga/effects'
import { save } from '../../utils/file'
import { getProject } from './selectors'

export function* saveProject (action) {
  const data = yield select(getProject)
  yield call(save, action.payload.filePath, data)
}

export function* saveSaga () {
  yield takeEvery('PROJECT_SAVE', saveProject)
}

