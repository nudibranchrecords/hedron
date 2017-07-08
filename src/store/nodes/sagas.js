import { select, takeEvery, put } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import { rNodeCreate, rNodeDelete, uNodeDelete } from './actions'

export function* nodeCreate (action) {
  const p = action.payload
  const node = p.node

  yield put(rNodeCreate(p.id, node))
}

export function* nodeDelete (action) {
  const p = action.payload

  // Need to delete associated inputLinks

  yield put(rNodeDelete(p.nodeId))
}

export function* watchNodes () {
  yield takeEvery('U_NODE_CREATE', nodeCreate)
  yield takeEvery('U_NODE_DELETE', nodeDelete)
}
