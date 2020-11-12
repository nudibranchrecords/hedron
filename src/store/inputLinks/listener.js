import uid from 'uid'

import { constructMidiId } from '../../utils/midiMessage'

import getInputLink from '../../selectors/getInputLink'
import getNodes from '../../selectors/getNodes'
import { getDefaultModifierIds } from './selectors'
import getNode from '../../selectors/getNode'

import { inputAssignedLinkCreate, inputAssignedLinkDelete } from '../inputs/actions'
import { rNodeCreate, uNodeDelete, uNodeInputLinkAdd, nodeUpdate,
  nodeInputLinkRemove, nodeActiveInputLinkToggle, rNodeDelete } from '../nodes/actions'
import { rInputLinkAdd, rInputLinkDelete } from './actions'
import { uAnimStart } from '../anims/actions'
import { midiStartLearning } from '../midi/actions'

import lfoGenerateOptions from '../../utils/lfoGenerateOptions'
import midiGenerateOptions from '../../utils/midiGenerateOptions'
import sequencerGenerateOptions from '../../utils/sequencerGenerateOptions'
import animGenerateOptions from '../../utils/animGenerateOptions'
import audioGenerateOptions from '../../utils/audioGenerateOptions'

import { getAll } from '../../externals/modifiers'

/*
  Creates the link between input and node.
  e.g. A paramater can have inputs assigned to it. This is done by creating
  an input link. The link takes in the input value, sends it through modifiers and then
  applies that value to the param.
*/
const handleInputLinkCreate = (action, store) => {
  let state = store.getState()

  const p = action.payload
  const m = p.meta
  const modifierIds = []
  const optionIds = []
  let linkableActions = {}
  let nodeType, linkType, sequencerGridId, nodeValueType
  const node = getNode(state, p.nodeId)
  const sketchId = node.sketchId

  if (p.inputId === 'midi-learn') {
    store.dispatch(midiStartLearning(p.nodeId, p.inputType))
  } else {
    const linkId = uid()
    if (p.inputType === 'linkableAction') {
      linkType = 'linkableAction'
    } else {
      linkType = 'node'
      nodeType = node.type
      nodeValueType = node.valueType
      if (['audio', 'lfo'].includes(p.inputType)) {
        const modifiers = getAll()
        const defaultModifierIds = getDefaultModifierIds(state)

        for (let i = 0; i < defaultModifierIds.length; i++) {
          const id = defaultModifierIds[i]
          const config = modifiers[id].config

          for (let j = 0; j < config.title.length; j++) {
            if (!config.targets || config.targets.includes(p.inputId)) {
              const modifierId = uid()
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
              store.dispatch(rNodeCreate(modifierId, modifier))
            }
          }
        }
      }
    }

    // Populate optionIds
    switch (p.inputType) {
      case 'audio': {
        const audioOpts = audioGenerateOptions(nodeValueType)

        for (let key in audioOpts) {
          const item = audioOpts[key]
          item.sketchId = sketchId
          item.parentNodeId = linkId
          optionIds.push(item.id)

          store.dispatch(rNodeCreate(item.id, item))
        }
        break
      }

      case 'lfo': {
        const lfoOpts = lfoGenerateOptions(nodeValueType)

        for (let key in lfoOpts) {
          const item = lfoOpts[key]
          item.sketchId = sketchId
          item.parentNodeId = linkId
          optionIds.push(item.id)

          store.dispatch(rNodeCreate(item.id, item))
        }
        break
      }

      case 'seq-step': {
        const seqOpts = sequencerGenerateOptions(nodeValueType)
        sequencerGridId = seqOpts.grid.id
        store.dispatch(rNodeCreate(sequencerGridId, seqOpts.grid))
        break
      }

      case 'midi': {
        if (linkType === 'node') {
          const midiOpts = midiGenerateOptions(nodeValueType, linkId)

          for (let key in midiOpts) {
            const item = midiOpts[key]
            item.sketchId = sketchId
            item.parentNodeId = linkId
            optionIds.push(item.id)

            if (item.key === 'controlType' && m.controlType) item.value = m.controlType
            if (item.key === 'channel' && m.channel) item.value = m.channel
            if (item.key === 'noteNum' && m.noteNum) item.value = m.noteNum
            if (item.key === 'messageType' && m.messageType) item.value = m.messageType

            store.dispatch(rNodeCreate(item.id, item))
          }
        }
        break
      }

      case 'anim': {
        const animStartActionId = uid()
        const node = {
          type: 'linkableAction',
          title: 'Start Anim',
          action: uAnimStart(linkId),
          sketchId,
          parentNodeId: linkId,
        }
        store.dispatch(rNodeCreate(animStartActionId, node))
        linkableActions.animStart = animStartActionId

        const animOpts = animGenerateOptions(nodeValueType)

        for (let key in animOpts) {
          const item = animOpts[key]
          optionIds.push(item.id)
          item.sketchId = sketchId
          item.parentNodeId = linkId

          store.dispatch(rNodeCreate(item.id, item))
        }
      }
    }

    if (linkType === 'node') {
      const toggleActionId = uid()
      const node = {
        type: 'linkableAction',
        title: 'Toggle Activate',
        action: nodeActiveInputLinkToggle(p.nodeId, linkId),
        sketchId,
        parentNodeId: linkId,
      }
      store.dispatch(rNodeCreate(toggleActionId, node))
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

    store.dispatch(rNodeCreate(linkId, link))
    store.dispatch(rInputLinkAdd(linkId))
    store.dispatch(uNodeInputLinkAdd(p.nodeId, linkId))
    store.dispatch(inputAssignedLinkCreate(p.inputId, linkId))
  }
}

const handleInputLinkDelete = (action, store) => {
  const state = store.getState()
  const p = action.payload

  const link = getInputLink(state, p.id)

  const { input, modifierIds, nodeId, optionIds, linkableActions } = link

  if (modifierIds) {
    for (let i = 0; i < modifierIds.length; i++) {
      store.dispatch(uNodeDelete(modifierIds[i]))
    }
  }

  if (optionIds) {
    for (let i = 0; i < optionIds.length; i++) {
      store.dispatch(uNodeDelete(optionIds[i]))
    }
  }

  for (const key in linkableActions) {
    store.dispatch(uNodeDelete(linkableActions[key]))
  }

  store.dispatch(inputAssignedLinkDelete(input.id, p.id))
  store.dispatch(nodeInputLinkRemove(nodeId, p.id))
  store.dispatch(rNodeDelete(p.id))
  store.dispatch(rInputLinkDelete(p.id))
}

const handleUpdateMidiInput = (action, store) => {
  const state = store.getState()
  const link = getInputLink(state, action.payload.linkId)
  const opts = getNodes(state, link.optionIds)

  let messageType, noteNum, channel

  opts.forEach(opt => {
    if (opt.key === 'messageType') messageType = opt.value
    if (opt.key === 'noteNum') noteNum = opt.value
    if (opt.key === 'channel') channel = opt.value
  })

  const newInputId = constructMidiId(messageType, noteNum, channel)

  store.dispatch(inputAssignedLinkDelete(link.input.id, link.id))
  store.dispatch(inputAssignedLinkCreate(newInputId, link.id))
  store.dispatch(nodeUpdate(link.id, { input: { id: newInputId, type: 'midi' } }))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_INPUT_LINK_UPDATE_MIDI_INPUT':
      handleUpdateMidiInput(action, store)
      break
    case 'U_INPUT_LINK_CREATE':
      handleInputLinkCreate(action, store)
      break
    case 'U_INPUT_LINK_DELETE':
      handleInputLinkDelete(action, store)
      break
  }
}

