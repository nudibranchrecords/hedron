import { select, takeEvery, put } from 'redux-saga/effects'
import getNode from '../../selectors/getNode'
import { uInputLinkDelete } from '../inputLinks/actions'
import { rNodeDelete, rNodeInputLinkAdd, nodeTabOpen } from './actions'

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

export function* nodeInputLinkAdd (action) {
  const p = action.payload

  yield put(rNodeInputLinkAdd(p.id, p.linkId))
  yield put(nodeTabOpen(p.id, p.linkId))
}

export function* watchNodes () {
  yield takeEvery('U_NODE_DELETE', nodeDelete)
  yield takeEvery('U_NODE_INPUT_LINK_ADD', nodeInputLinkAdd)
}
