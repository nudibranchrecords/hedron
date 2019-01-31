import { select, put, call, takeEvery } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import { rInputLinkCreate, rInputLinkDelete } from './actions'
import { uAnimStart } from '../anims/actions'
import { rNodeCreate, uNodeCreate, uNodeDelete, uNodeInputLinkAdd,
  nodeInputLinkRemove, nodeActiveInputLinkToggle } from '../nodes/actions'
import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import { linkableActionCreate, linkableActionInputLinkAdd,
  linkableActionInputLinkRemove, linkableActionDelete } from '../linkableActions/actions'
import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
import midiGenerateOptions from '../../utils/midiGenerateOptions'
import sequencerGenerateOptions from '../../utils/sequencerGenerateOptions'
import animGenerateOptions from '../../utils/animGenerateOptions'
import audioGenerateOptions from '../../utils/audioGenerateOptions'
import { midiStartLearning } from '../midi/actions'
import getCurrentBankIndex from '../../selectors/getCurrentBankIndex'
import { getAll } from '../../externals/modifiers'
import uid from 'uid'

/*
  Creates the link between input and node.
  e.g. A paramater can have inputs assigned to it. This is done by creating
  an input link. The link takes in the input value, sends it through modifiers and then
  applies that value to the param.
*/
export function* inputLinkCreate (action) {
  const p = action.payload
  const modifierIds = []
  const lfoOptionIds = []
  const midiOptionIds = []
  const animOptionIds = []
  const audioOptionIds = []
  let linkableActions = {}
  let bankIndex, node, nodeType, linkType, sequencerGridId

  if (p.inputId === 'midi') {
    yield put(midiStartLearning(p.nodeId, p.inputType))
  } else {
    const linkId = yield call(uid)
    if (p.inputType === 'linkableAction') {
      linkType = 'linkableAction'
    } else {
      linkType = 'node'
      node = yield select(getNode, p.nodeId)
      nodeType = node.type
      if (p.inputType !== 'midi' && p.inputId !== 'seq-step' && p.inputId !== 'anim') {
        const modifiers = yield call(getAll)
        const defaultModifierIds = yield select(getDefaultModifierIds)

        for (let i = 0; i < defaultModifierIds.length; i++) {
          const id = defaultModifierIds[i]
          const config = modifiers[id].config

          for (let j = 0; j < config.title.length; j++) {
            if (!config.type || config.type === p.inputType) {
              const modifierId = yield call(uid)
              const modifier = {
                id: modifierId,
                key: id,
                title: config.title[j],
                value: config.defaultValue[j],
                passToNext: j < config.title.length - 1,
                inputLinkIds: [],
                type: config.type,
                subNode: true,
              }

              modifierIds.push(modifierId)
              yield put(rNodeCreate(modifierId, modifier))
            }
          }
        }
      }
    }

    if (p.inputId === 'audio') {
      const audioOpts = yield call(audioGenerateOptions)

      for (let key in audioOpts) {
        const item = audioOpts[key]
        audioOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }
    }

    if (p.inputId === 'lfo') {
      const lfoOpts = yield call(lfoGenerateOptions)

      for (let key in lfoOpts) {
        const item = lfoOpts[key]
        lfoOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }
    }

    if (p.inputId === 'seq-step') {
      const seqOpts = yield call(sequencerGenerateOptions)
      sequencerGridId = seqOpts.grid.id
      yield put(uNodeCreate(sequencerGridId, seqOpts.grid))
    }

    if (p.inputType === 'midi' || linkType === 'linkableAction') {
      bankIndex = yield select(getCurrentBankIndex, p.deviceId)

      if (linkType === 'node') {
        const midiOpts = yield call(midiGenerateOptions)

        for (let key in midiOpts) {
          const item = midiOpts[key]
          midiOptionIds.push(item.id)

          if (item.key === 'controlType' && p.controlType) {
            item.value = p.controlType
          }

          yield put(uNodeCreate(item.id, item))
        }
      }
    }

    if (p.inputType === 'anim') {
      const animStartActionId = yield call(uid)
      yield put(linkableActionCreate(animStartActionId, uAnimStart(linkId)))
      linkableActions.animStart = animStartActionId

      const animOpts = yield call(animGenerateOptions)

      for (let key in animOpts) {
        const item = animOpts[key]
        animOptionIds.push(item.id)

        yield put(uNodeCreate(item.id, item))
      }
    }

    if (linkType === 'node') {
      const toggleActionId = yield call(uid)
      yield put(linkableActionCreate(toggleActionId, nodeActiveInputLinkToggle(p.nodeId, linkId)))
      linkableActions.toggleActivate = toggleActionId
    }

    const link = {
      title: p.inputId,
      input: {
        id: p.inputId,
        type: p.inputType,
      },
      id: linkId,
      nodeId: p.nodeId,
      nodeType,
      deviceId: p.deviceId,
      bankIndex,
      modifierIds,
      lfoOptionIds,
      midiOptionIds,
      audioOptionIds,
      linkableActions,
      sequencerGridId,
      linkType,
      animOptionIds,
    }

    yield put(rInputLinkCreate(linkId, link))
    if (linkType === 'node') {
      yield put(uNodeInputLinkAdd(p.nodeId, linkId))
    } else if (linkType === 'linkableAction') {
      yield put(linkableActionInputLinkAdd(p.nodeId, linkId))
    }
    yield put(inputAssignedLinkCreate(p.inputId, linkId, p.deviceId))
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

  if (link.linkType === 'linkableAction') {
    yield put(linkableActionInputLinkRemove(nodeId, p.id))
  } else {
    yield put(nodeInputLinkRemove(nodeId, p.id))
  }

  for (const key in link.linkableActions) {
    yield put(linkableActionDelete(link.linkableActions[key]))
  }

  yield put(rInputLinkDelete(p.id))
}

export function* watchInputLinks () {
  yield takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
  yield takeEvery('U_INPUT_LINK_DELETE', inputLinkDelete)
}
