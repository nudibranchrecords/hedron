import 'babel-polyfill'
import test from 'tape'
import { select, put, call, takeEvery } from 'redux-saga/effects'

import { getDefaultModifierIds } from '../selectors'
import { rNodeCreate, nodeInputLinkAdd } from '../../nodes/actions'
import { rInputLinkCreate, uInputLinkCreate } from '../actions'
import { inputAssignedLinkCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'

import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { inputLinkCreate, watchInputLinks } = proxyquire('../sagas', {
  'modifiers': { getAll }
})

test('(Saga) watchInputLinks', (t) => {
  const generator = watchInputLinks()
  t.deepEqual(
    generator.next().value,
    takeEvery('U_INPUT_LINK_CREATE', inputLinkCreate)
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) inputLinkCreate', (t) => {
  const nodeId = 'NODE1'
  const inputId = 'audio_0'
  const inputType = 'audio'

  let modifier, uniqueId

  const generator = inputLinkCreate(uInputLinkCreate(nodeId, inputId, inputType))

  t.deepEqual(
    generator.next().value,
    call(uid),
    '0. Generate unique ID for link'
  )

  const linkId = 'LINK1'

  t.deepEqual(
    generator.next(linkId).value,
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

  const link = {
    id: linkId,
    title: inputId,
    input: {
      id: inputId,
      type: inputType
    },
    nodeId,
    modifierIds: ['xxx', 'yyy', 'zzz']
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
    put(inputAssignedLinkCreate(inputId, linkId)),
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
