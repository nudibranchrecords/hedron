import { select, takeEvery, put } from 'redux-saga/effects'
import { getNodeInputId } from './selectors'
import getNode from '../../selectors/getNode'
import { rNodeInputUpdate, rNodeCreate, rNodeDelete, uNodeDelete } from './actions'
import { inputAssignedNodeDelete, inputAssignedNodeCreate } from '../inputs/actions'
import { midiStartLearning } from '../midi/actions'

export function* nodeInputUpdate (action) {
  const p = action.payload
  const inputId = p.inputId
  const input = inputId ? { id: inputId, type: p.inputType } : false

  const oldInputId = yield select(getNodeInputId, p.nodeId)

  if (oldInputId) {
    yield put(inputAssignedNodeDelete(oldInputId, p.nodeId))
  }

  if (inputId === 'midi') {
    yield put(midiStartLearning(p.nodeId))
  } else {
    if (inputId) {
      yield put(inputAssignedNodeCreate(inputId, p.nodeId))
    }
    yield put(rNodeInputUpdate(p.nodeId, input))
  }
}

export function* nodeCreate (action) {
  const p = action.payload
  const node = p.node

  yield put(rNodeCreate(p.id, node))
}

export function* nodeDelete (action) {
  const p = action.payload

  const node = yield select(getNode, p.nodeId)

  const { input, modifierIds, lfoOptionIds } = node

  if (input && node.input.id) {
    yield put(inputAssignedNodeDelete(node.input.id, p.nodeId))
  }

  if (modifierIds) {
    for (let i = 0; i < modifierIds.length; i++) {
      yield put(uNodeDelete(modifierIds[i]))
    }
  }

  if (lfoOptionIds) {
    for (let i = 0; i < lfoOptionIds.length; i++) {
      yield put(uNodeDelete(lfoOptionIds[i]))
    }
  }

  yield put(rNodeDelete(p.nodeId))
}

export function* watchNodes () {
  yield takeEvery('U_NODE_INPUT_UPDATE', nodeInputUpdate)
  yield takeEvery('U_NODE_CREATE', nodeCreate)
  yield takeEvery('U_NODE_DELETE', nodeDelete)
}
