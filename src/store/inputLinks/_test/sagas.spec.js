import 'babel-polyfill'
import test from 'tape'
import { select, put, call } from 'redux-saga/effects'
import lfoGenerateOptions from '../../../utils/lfoGenerateOptions'
import { getDefaultModifierIds } from '../selectors'
import getNode from '../../../selectors/getNode'
import { uNodeCreate, rNodeCreate, nodeInputLinkAdd } from '../../nodes/actions'
import { rInputLinkCreate, uInputLinkCreate } from '../actions'
import { inputAssignedLinkCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'

import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { inputLinkCreate } = proxyquire('../sagas', {
  'modifiers': { getAll }
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
    type: 'FOO'
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
        type: 'audio'
      }
    },
    bar: {
      config: {
        title: ['Barey1', 'Barey2'],
        defaultValue: [0.5, 0.5]
      }
    }
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
    inputLinkIds: []
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
    inputLinkIds: []
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
    inputLinkIds: []
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
      value: 'sine'
    },
    {
      id: 'LFO2',
      key: 'rate',
      value: 1
    }
  ]

  t.deepEqual(
    generator.next(lfoOpts).value,
    put(uNodeCreate('LFO1', {
      key: 'shape',
      id: 'LFO1',
      value: 'sine'
    })),
    'Dispatch node create action'
  )

  t.deepEqual(
    generator.next().value,
    put(uNodeCreate('LFO2', {
      key: 'rate',
      id: 'LFO2',
      value: 1
    })),
    'Dispatch node create action'
  )

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType
    },
    nodeId,
    nodeType: 'FOO',
    modifierIds: ['xxx', 'yyy', 'zzz'],
    lfoOptionIds: ['LFO1', 'LFO2']
  }

  t.deepEqual(
    generator.next().value,
    put(rInputLinkCreate(linkId, link)),
    '5. Create input link'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeInputLinkAdd(nodeId, linkId)),
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
    put(midiStartLearning(nodeId)),
    '0. Start Midi Learn'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
