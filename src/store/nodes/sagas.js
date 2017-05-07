import { select, takeEvery, put, call } from 'redux-saga/effects'
import { getNodeInputId, getDefaultModifierIds } from './selectors'
import { rNodeInputUpdate, rNodeCreate } from './actions'
import { inputAssignedNodeDelete, inputAssignedNodeCreate } from '../inputs/actions'
import { midiStartLearning } from '../midi/actions'
import { getAll } from 'modifiers'
import uid from 'uid'

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

  const modifiers = yield call(getAll)
  const defaultModifierIds = yield select(getDefaultModifierIds)
  const modifierIds = []

  for (let i = 0; i < defaultModifierIds.length; i++) {
    const id = defaultModifierIds[i]
    const config = modifiers[id].config

    const modifierId = yield call(uid)

    const modifier = {
      id: modifierId,
      key: id,
      title: config.title,
      value: config.defaultValue,
      type: config.type
    }

    modifierIds.push(modifierId)
    yield put(rNodeCreate(modifierId, modifier))
  }

  const node = p.node
  node.modifierIds = modifierIds

  yield put(rNodeCreate(p.id, node))
}

export function* watchNodes () {
  yield takeEvery('U_NODE_INPUT_UPDATE', nodeInputUpdate)
  yield takeEvery('U_NODE_CREATE', nodeCreate)
}
