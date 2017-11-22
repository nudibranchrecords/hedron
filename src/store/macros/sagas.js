import { select, put, call, takeEvery } from 'redux-saga/effects'
import { rNodeCreate } from '../nodes/actions'
import { rMacroCreate } from './actions'

import uid from 'uid'

export function* macroCreate (action) {
  const macroId = yield call(uid)
  const nodeId = yield call(uid)
  yield put(rNodeCreate(nodeId, {
    value: 0
  }))
  yield put(rMacroCreate(macroId, nodeId))
}

export function* watchMacros () {
  yield takeEvery('U_MACRO_CREATE', macroCreate)
}
