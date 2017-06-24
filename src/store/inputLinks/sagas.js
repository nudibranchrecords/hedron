import { select, put, call, takeEvery } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import { rInputLinkCreate, uInputLinkUpdate } from './actions'
import { rNodeCreate, nodeInputLinkAdd } from '../nodes/actions'
import { midiStartLearning } from '../midi/actions'
import { getAll } from 'modifiers'
import uid from 'uid'

/*
  Creates the link between input and node.
  e.g. A paramater can have inputs assigned to it. This is done by creating
  an input link. The link takes in the input value, sends it through modifiers and then
  applies that value to the param.
*/
export function* inputLinkCreate (action) {
  const p = action.payload
  if (p.inputId === 'midi') {
    yield put(midiStartLearning(p.nodeId))
  } else {
    const linkId = yield call(uid)
    const modifiers = yield call(getAll)
    const defaultModifierIds = yield select(getDefaultModifierIds)
    const modifierIds = []

    for (let i = 0; i < defaultModifierIds.length; i++) {
      const id = defaultModifierIds[i]
      const config = modifiers[id].config

      for (let j = 0; j < config.title.length; j++) {
        const modifierId = yield call(uid)
        const modifier = {
          id: modifierId,
          key: id,
          title: config.title[j],
          value: config.defaultValue[j],
          passToNext: j < config.title.length - 1,
          type: config.type
        }

        modifierIds.push(modifierId)
        yield put(rNodeCreate(modifierId, modifier))
      }
    }

    const link = {
      title: p.inputId,
      id: linkId,
      nodeId: p.nodeId,
      modifierIds
    }

    yield put(rInputLinkCreate(linkId, link))
    yield put(uInputLinkUpdate(linkId, p.inputId, p.inputType))
    yield put(nodeInputLinkAdd(p.nodeId, linkId))
  }
}

export function* inputLinkUpdate (action) {
  // const p = action.payload
  // const inputId = p.inputId
  // const input = inputId ? { id: inputId, type: p.inputType } : false
  //
  // const oldInputId = yield select(getNodeInputId, p.nodeId)
  //
  // if (oldInputId) {
  //   yield put(inputAssignedLinkDelete(oldInputId, p.nodeId))
  // }
  //
  // if (inputId === 'midi') {
  //   yield put(midiStartLearning(p.nodeId))
  // } else {
  //   if (inputId) {
  //     yield put(inputAssignedNodeCreate(inputId, p.nodeId))
  //   }
  //   yield put(rNodeInputUpdate(p.nodeId, input))
  // }
}

export function* watchInputLinks () {
  yield takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
}
