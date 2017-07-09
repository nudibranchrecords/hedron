import { select, put, call, takeEvery } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import { rInputLinkCreate, rInputLinkDelete } from './actions'
import { rNodeCreate, uNodeCreate, uNodeDelete, nodeInputLinkAdd, nodeInputLinkRemove } from '../nodes/actions'
import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
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
    const node = yield select(getNode, p.nodeId)
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
          inputLinkIds: [],
          type: config.type
        }

        modifierIds.push(modifierId)
        yield put(rNodeCreate(modifierId, modifier))
      }
    }

    const lfoOpts = yield call(lfoGenerateOptions)
    const lfoOptionIds = []

    for (let key in lfoOpts) {
      const item = lfoOpts[key]
      lfoOptionIds.push(item.id)

      yield put(uNodeCreate(item.id, item))
    }

    const link = {
      title: p.inputId,
      input: {
        id: p.inputId,
        type: p.inputType
      },
      id: linkId,
      nodeId: p.nodeId,
      nodeType: node.type,
      modifierIds,
      lfoOptionIds
    }

    yield put(rInputLinkCreate(linkId, link))
    yield put(nodeInputLinkAdd(p.nodeId, linkId))
    yield put(inputAssignedLinkCreate(p.inputId, linkId))
  }
}

export function* inputLinkDelete (action) {
  const p = action.payload

  const link = yield select(getInputLink, p.id)

  const { input, modifierIds, nodeId } = link

  yield put(inputAssignedLinkDelete(input.id, p.id))

  if (modifierIds) {
    for (let i = 0; i < modifierIds.length; i++) {
      yield put(uNodeDelete(modifierIds[i]))
    }
  }

  yield put(nodeInputLinkRemove(nodeId, p.id))
  yield put(rInputLinkDelete(p.id))
}

export function* watchInputLinks () {
  yield takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
  yield takeEvery('U_INPUT_LINK_DELETE', inputLinkDelete)
}
