import { select, put, call, takeEvery } from 'redux-saga/effects'
import { getDefaultModifierIds } from './selectors'
import getInputLink from '../../selectors/getInputLink'
import getNode from '../../selectors/getNode'
import { rInputLinkAdd, rInputLinkDelete } from './actions'
import { uAnimStart } from '../anims/actions'
import {
  rNodeCreate, uNodeCreate, uNodeDelete, uNodeInputLinkAdd,
  nodeInputLinkRemove, nodeActiveInputLinkToggle, rNodeDelete
} from '../nodes/actions'
import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
import midiGenerateOptions from '../../utils/midiGenerateOptions'
import sequencerGenerateOptions from '../../utils/sequencerGenerateOptions'
import animGenerateOptions from '../../utils/animGenerateOptions'
import audioGenerateOptions from '../../utils/audioGenerateOptions'
import { midiStartLearning } from '../midi/actions'
import { getAll } from '../../externals/modifiers'
import uid from 'uid'

/*
  Creates the link between input and node.
  e.g. A paramater can have inputs assigned to it. This is done by creating
  an input link. The link takes in the input value, sends it through modifiers and then
  applies that value to the param.
*/
export function* inputLinkCreate(action) {
  const p = action.payload
  const m = p.meta
  const modifierIds = []
  const optionIds = []
  let linkableActions = {}
  let nodeType, linkType, sequencerGridId, nodeValueType
  const node = yield select(getNode, p.nodeId)
  const sketchId = node.sketchId

  if (p.inputId === 'midi-learn') {
    yield put(midiStartLearning(p.nodeId, p.inputType))
  } else {
    const linkId = yield call(uid)
    if (p.inputType === 'linkableAction') {
      linkType = 'linkableAction'
    } else {
      linkType = 'node'
      nodeType = node.type
      nodeValueType = node.valueType
      if (['audio', 'lfo'].includes(p.inputType)) {
        const modifiers = yield call(getAll)
        const defaultModifierIds = yield select(getDefaultModifierIds)

        for (let i = 0; i < defaultModifierIds.length; i++) {
          const id = defaultModifierIds[i]
          const config = modifiers[id].config

          for (let j = 0; j < config.title.length; j++) {
            if (!config.targets || config.targets.includes(p.inputId)) {
              const modifierId = yield call(uid)
              const modifier = {
                id: modifierId,
                parentNodeId: linkId,
                sketchId,
                key: id,
                title: config.title[j],
                value: config.defaultValue[j],
                passToNext: j < config.title.length - 1,
                inputLinkIds: [],
                valueType: (config.valueType && config.valueType[j]) || 'float',
                options: config.controlOptions && config.controlOptions[j],
                subNode: true,
              }

              modifierIds.push(modifierId)
              yield put(rNodeCreate(modifierId, modifier))
            }
          }
        }
      }
    }

    // Populate optionIds
    switch (p.inputType) {
      case 'audio': {
        const audioOpts = yield call(audioGenerateOptions, nodeValueType)

        for (let key in audioOpts) {
          const item = audioOpts[key]
          item.sketchId = sketchId
          item.parentNodeId = linkId
          optionIds.push(item.id)

          yield put(uNodeCreate(item.id, item))
        }
        break
      }

      case 'lfo': {
        const lfoOpts = yield call(lfoGenerateOptions, nodeValueType)

        for (let key in lfoOpts) {
          const item = lfoOpts[key]
          item.sketchId = sketchId
          item.parentNodeId = linkId
          optionIds.push(item.id)

          yield put(uNodeCreate(item.id, item))
        }
        break
      }

      case 'seq-step': {
        const seqOpts = yield call(sequencerGenerateOptions, nodeValueType)
        sequencerGridId = seqOpts.grid.id
        yield put(uNodeCreate(sequencerGridId, seqOpts.grid))
        break
      }

      case 'midi': {
        if (linkType === 'node') {
          const midiOpts = yield call(midiGenerateOptions, nodeValueType, linkId)

          for (let key in midiOpts) {
            const item = midiOpts[key]
            item.sketchId = sketchId
            item.parentNodeId = linkId
            optionIds.push(item.id)

            if (item.key === 'controlType' && m.controlType) item.value = m.controlType
            if (item.key === 'channel' && m.channel) item.value = m.channel
            if (item.key === 'noteNum' && m.noteNum) item.value = m.noteNum
            if (item.key === 'messageType' && m.messageType) item.value = m.messageType

            yield put(uNodeCreate(item.id, item))
          }
        }
        break
      }

      case 'anim': {
        const animStartActionId = yield call(uid)
        const node = {
          type: 'linkableAction',
          title: 'Start Anim',
          action: uAnimStart(linkId),
          sketchId,
          parentNodeId: linkId,
        }
        yield put(uNodeCreate(animStartActionId, node))
        linkableActions.animStart = animStartActionId

        const animOpts = yield call(animGenerateOptions, nodeValueType)

        for (let key in animOpts) {
          const item = animOpts[key]
          optionIds.push(item.id)
          item.sketchId = sketchId
          item.parentNodeId = linkId

          yield put(uNodeCreate(item.id, item))
        }
      }
    }

    if (linkType === 'node') {
      const toggleActionId = yield call(uid)
      const node = {
        type: 'linkableAction',
        title: 'Toggle Activate',
        action: nodeActiveInputLinkToggle(p.nodeId, linkId),
        sketchId,
        parentNodeId: linkId,
      }
      yield put(uNodeCreate(toggleActionId, node))
      linkableActions.toggleActivate = toggleActionId
    }

    const link = {
      title: p.inputId,
      type: 'inputLink',
      input: {
        id: p.inputId,
        type: p.inputType,
      },
      id: linkId,
      nodeId: p.nodeId,
      sketchId,
      parentNodeId: p.nodeId,
      nodeType,
      modifierIds,
      optionIds,
      linkableActions,
      sequencerGridId,
      linkType,
    }

    yield put(rNodeCreate(linkId, link))
    yield put(rInputLinkAdd(linkId))
    yield put(uNodeInputLinkAdd(p.nodeId, linkId))
    yield put(inputAssignedLinkCreate(p.inputId, linkId))
  }
}

export function* inputLinkDelete(action) {
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

  for (const key in link.linkableActions) {
    yield put(uNodeDelete(link.linkableActions[key]))
  }

  yield put(rNodeDelete(p.id))
  yield put(rInputLinkDelete(p.id))
}

export function* watchInputLinks() {
  yield takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
  yield takeEvery('U_INPUT_LINK_DELETE', inputLinkDelete)
}
