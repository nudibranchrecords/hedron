/*
DISABLING BECAUSE THIS WONT BE SAGA FOR MUCH LONGER
ALSO WILL BE CHANGING TEST LIB

import 'babel-polyfill'
import test from 'tape'
import { select, put, call } from 'redux-saga/effects'
import lfoGenerateOptions from '../../../utils/lfoGenerateOptions'
import midiGenerateOptions from '../../../utils/midiGenerateOptions'
import sequencerGenerateOptions from '../../../utils/sequencerGenerateOptions'
import { getDefaultModifierIds } from '../selectors'
import getNode from '../../../selectors/getNode'
import { uNodeCreate, rNodeCreate, uNodeInputLinkAdd, nodeActiveInputLinkToggle } from '../../nodes/actions'
import { rInputLinkCreate, uInputLinkCreate } from '../actions'
import { inputAssignedLinkCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'
import { linkableActionCreate, linkableActionInputLinkAdd } from '../../linkableActions/actions'
import getCurrentBankIndex from '../../../selectors/getCurrentBankIndex'

import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { inputLinkCreate } = proxyquire('../sagas', {
  '../../externals/modifiers': { getAll },
})

test('(Saga) inputLinkCreate', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'audio_0'
  const inputType = 'audio'
  const deviceId = 'DEVICE1'

  let modifier, uniqueId

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType, deviceId))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
    select(getNode, 'NODE1'),
    '0.1 get linked node'
  )

  const node = {
    type: 'FOO',
  }

  t.deepEqual(
    generator.next(node).value,
    call(getAll),
    '1. get All modifiers'
  )

  const modifiers = {
    foo: {
      config: {
        title: ['Fooey'],
        defaultValue: [0.2],
        type: 'audio',
      },
    },
    bar: {
      config: {
        title: ['Barey1', 'Barey2'],
        defaultValue: [0.5, 0.5],
      },
    },
  }

  t.deepEqual(
    generator.next(modifiers).value,
    select(getDefaultModifierIds),
    '2. get default modifier Ids'
  )

  const defaults = ['foo', 'bar']

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'xxx'
  modifier = {
    id: 'xxx',
    key: 'foo',
    title: 'Fooey',
    passToNext: false,
    value: 0.2,
    type: 'audio',
    inputLinkIds: [],
    subNode: true,
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'yyy'
  modifier = {
    id: 'yyy',
    key: 'bar',
    title: 'Barey1',
    passToNext: true,
    value: 0.5,
    type: undefined,
    inputLinkIds: [],
    subNode: true,
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'zzz'
  modifier = {
    id: 'zzz',
    key: 'bar',
    title: 'Barey2',
    passToNext: false,
    value: 0.5,
    type: undefined,
    inputLinkIds: [],
    subNode: true,
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next().value,
    call(uid),
    'Generate unique ID for linkableAction'
  )

  const actionId = '@@__TOGGLE_ACTIVATE'

  t.deepEqual(
    generator.next(actionId).value,
    put(linkableActionCreate(actionId, nodeActiveInputLinkToggle(nodeId, linkId))),
    'Dispatch linkableAction create'
  )

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType,
    },
    nodeId,
    deviceId,
    bankIndex: undefined,
    nodeType: 'FOO',
    modifierIds: ['xxx', 'yyy', 'zzz'],
    lfoOptionIds: [],
    midiOptionIds: [],
    linkableActions: {
      toggleActivate: actionId,
    },
    linkType: 'node',
    sequencerGridId: undefined,
  }

  t.deepEqual(
    generator.next().value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeInputLinkAdd(nodeId, linkId)),
    '6. Add input link id to node'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedLinkCreate(inputId, linkId, deviceId)),
    '7. Update assigned link in input'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate - LFO', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'lfo'
  const inputType = undefined
  const deviceId = 'DEVICE1'

  let modifier, uniqueId

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType, deviceId))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
    select(getNode, 'NODE1'),
    '0.1 get linked node'
  )

  const node = {
    type: 'FOO',
  }

  t.deepEqual(
    generator.next(node).value,
    call(getAll),
    '1. get All modifiers'
  )

  const modifiers = {
    foo: {
      config: {
        title: ['Fooey'],
        defaultValue: [0.2],
        type: 'audio',
      },
    },
    bar: {
      config: {
        title: ['Barey1', 'Barey2'],
        defaultValue: [0.5, 0.5],
      },
    },
  }

  t.deepEqual(
    generator.next(modifiers).value,
    select(getDefaultModifierIds),
    '2. get default modifier Ids'
  )

  const defaults = ['foo', 'bar']

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'yyy'
  modifier = {
    id: 'yyy',
    key: 'bar',
    title: 'Barey1',
    passToNext: true,
    value: 0.5,
    type: undefined,
    inputLinkIds: [],
    subNode: true,
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'zzz'
  modifier = {
    id: 'zzz',
    key: 'bar',
    title: 'Barey2',
    passToNext: false,
    value: 0.5,
    type: undefined,
    inputLinkIds: [],
    subNode: true,
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  t.deepEqual(
    generator.next().value,
    call(lfoGenerateOptions),
    'Generate options for LFO'
  )

  const lfoOpts = [
    {
      id: 'LFO1',
      key: 'shape',
      value: 'sine',
    },
    {
      id: 'LFO2',
      key: 'rate',
      value: 1,
    },
  ]

  t.deepEqual(
    generator.next(lfoOpts).value,
    put(uNodeCreate('LFO1', {
      key: 'shape',
      id: 'LFO1',
      value: 'sine',
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeCreate('LFO2', {
      key: 'rate',
      id: 'LFO2',
      value: 1,
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    call(uid),
    'Generate unique ID for linkableAction'
  )

  const actionId = '@@__TOGGLE_ACTIVATE'

  t.deepEqual(
    generator.next(actionId).value,
    put(linkableActionCreate(actionId, nodeActiveInputLinkToggle(nodeId, linkId))),
    'Dispatch linkableAction create'
  )

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType,
    },
    nodeId,
    deviceId,
    bankIndex: undefined,
    nodeType: 'FOO',
    modifierIds: ['yyy', 'zzz'],
    lfoOptionIds: ['LFO1', 'LFO2'],
    midiOptionIds: [],
    linkableActions: {
      toggleActivate: actionId,
    },
    linkType: 'node',
    sequencerGridId: undefined,
  }

  t.deepEqual(
    generator.next().value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeInputLinkAdd(nodeId, linkId)),
    '6. Add input link id to node'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedLinkCreate(inputId, linkId, deviceId)),
    '7. Update assigned link in input'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate (type midi)', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'midi_xxx'
  const inputType = 'midi'
  const deviceId = 'DEVICE1'
  const controlType = 'rel1'

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType, deviceId, controlType))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
    select(getNode, 'NODE1'),
    '0.1 get linked node'
  )

  const node = {
    type: 'FOO',
  }

  t.deepEqual(
    generator.next(node).value,
    select(getCurrentBankIndex, deviceId),
    'Get current MIDI bank index'
  )

  const bankIndex = 3

  t.deepEqual(
    generator.next(bankIndex).value,
    call(midiGenerateOptions),
    'Generate options for Midi'
  )

  const midiOpts = [
    {
      id: 'MIDI1',
      key: 'bar',
    },
    {
      id: 'MIDI2',
      key: 'controlType',
      value: 'abs',
    },
  ]

  t.deepEqual(
    generator.next(midiOpts).value,
    put(uNodeCreate('MIDI1', {
      id: 'MIDI1',
      key: 'bar',
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeCreate('MIDI2', {
      id: 'MIDI2',
      key: 'controlType',
      value: controlType,
    })),
    'Dispatch node create action (with value as passed in controlType)'
  )

  t.deepEqual(
    generator.next().value,
    call(uid),
    'Generate unique ID for linkableAction'
  )

  const actionId = '@@__TOGGLE_ACTIVATE'

  t.deepEqual(
    generator.next(actionId).value,
    put(linkableActionCreate(actionId, nodeActiveInputLinkToggle(nodeId, linkId))),
    'Dispatch linkableAction create'
  )

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType,
    },
    nodeId,
    bankIndex,
    deviceId,
    nodeType: 'FOO',
    modifierIds: [],
    lfoOptionIds: [],
    midiOptionIds: ['MIDI1', 'MIDI2'],
    linkableActions: {
      toggleActivate: actionId,
    },
    linkType: 'node',
    sequencerGridId: undefined,
  }

  t.deepEqual(
    generator.next(bankIndex).value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeInputLinkAdd(nodeId, linkId)),
    '6. Add input link id to node'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedLinkCreate(inputId, linkId, deviceId)),
    '7. Update assigned link in input'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate (id seq-step)', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'seq-step'
  const inputType = undefined
  const deviceId = 'DEVICE1'

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType, deviceId))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
    select(getNode, 'NODE1'),
    '0.1 get linked node'
  )

  const node = {
    type: 'shot',
  }

  t.deepEqual(
    generator.next(node).value,
    call(sequencerGenerateOptions),
    'Generate options for sequencer'
  )

  const seqOptions = {
    grid: {
      id: 'SEQ01',
      grid: [0, 1, 0, 1],
    },
  }

  t.deepEqual(
    generator.next(seqOptions).value,
    put(uNodeCreate('SEQ01', {
      id: 'SEQ01',
      grid: [0, 1, 0, 1],
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    call(uid),
    'Generate unique ID for linkableAction'
  )

  const actionId = '@@__TOGGLE_ACTIVATE'

  t.deepEqual(
    generator.next(actionId).value,
    put(linkableActionCreate(actionId, nodeActiveInputLinkToggle(nodeId, linkId))),
    'Dispatch linkableAction create'
  )

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType,
    },
    nodeId,
    deviceId,
    bankIndex: undefined,
    nodeType: 'shot',
    modifierIds: [],
    lfoOptionIds: [],
    midiOptionIds: [],
    linkableActions: {
      toggleActivate: actionId,
    },
    sequencerGridId: 'SEQ01',
    linkType: 'node',
  }

  t.deepEqual(
    generator.next().value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeInputLinkAdd(nodeId, linkId)),
    '6. Add input link id to node'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedLinkCreate(inputId, linkId, deviceId)),
    '7. Update assigned link in input'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate (midi)', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'midi'
  const inputType = 'midi'

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType))

  t.deepEqual(
    generator.next().value,
    put(midiStartLearning(nodeId, 'midi')),
    '0. Start Midi Learn'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate (linkableAction)', (t) => {
  const nodeId = 'INPUTLINK1'
  const inputId = 'midi_xxx'
  const inputType = 'linkableAction'
  const deviceId = 'DEVICE1'

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType, deviceId))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
    select(getCurrentBankIndex, deviceId),
    'Get current MIDI bank index'
  )

  const bankIndex = 3

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType,
    },
    nodeId,
    nodeType: undefined,
    bankIndex,
    deviceId,
    modifierIds: [],
    lfoOptionIds: [],
    midiOptionIds: [],
    linkableActions: {},
    linkType: 'linkableAction',
    sequencerGridId: undefined,
  }

  t.deepEqual(
    generator.next(bankIndex).value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(linkableActionInputLinkAdd(nodeId, linkId)),
    '6. Add input link id to linkableAction'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedLinkCreate(inputId, linkId, deviceId)),
    '7. Update assigned link in input'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

*/
