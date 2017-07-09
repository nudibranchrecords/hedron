import { select, takeEvery, put } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import { uInputLinkDelete } from '../inputLinks/actions'
import { rNodeCreate, rNodeDelete } from './actions'

export function* nodeCreate (action) {
  const p = action.payload
  const node = p.node

  yield put(rNodeCreate(p.id, node))
}

export function* nodeDelete (action) {
  const p = action.payload

  const node = yield select(getNode, p.nodeId)

  const linkIds = node.inputLinkIds

  if (linkIds) {
    for (let i = 0; i < node.inputLinkIds.length; i++) {
      yield put(uInputLinkDelete(node.inputLinkIds[i]))
    }
  }

  yield put(rNodeDelete(p.nodeId))
}

export function* watchNodes () {
  yield takeEvery('U_NODE_CREATE', nodeCreate)
  yield takeEvery('U_NODE_DELETE', nodeDelete)
}
