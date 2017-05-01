import 'babel-polyfill'
import test from 'tape'
import { select, takeEvery, put, call } from 'redux-saga/effects'

import { getNodeInputId, getDefaultModifierIds } from '../selectors'
import { rNodeInputUpdate, rNodeCreate } from '../actions'
import { inputAssignedNodeDelete, inputAssignedNodeCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'
import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { watchNodes, nodeInputUpdate, nodeCreate } = proxyquire('../sagas', {
  'modifiers': { getAll }
})

test('(Saga) watchNodes', (t) => {
  const generator = watchNodes()
  t.deepEqual(
    generator.next().value,
    takeEvery('U_NODE_INPUT_UPDATE', nodeInputUpdate)
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('U_NODE_CREATE', nodeCreate)
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeCreate - sketch node', (t) => {
  const nodeId = 'XXX'
  const node = { foo: 'bar' }
  let modifier, uniqueId

  const generator = nodeCreate({
    payload: { id: nodeId, node }
  })

  t.deepEqual(
    generator.next(defaults).value,
    call(getAll),
    '1. get All modifiers'
  )

  const modifiers = {
    foo: {
      config: {
        title: 'Fooey',
        defaultValue: 0.2
      }
    },
    bar: {
      config: {
        title: 'Barey',
        defaultValue: 0.5
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
    value: 0.2
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
    title: 'Barey',
    value: 0.5
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rNodeCreate(uniqueId, modifier)),
    '4x. Create node (modifier)'
  )

  node.modifierIds = ['xxx', 'yyy']

  t.deepEqual(
    generator.next(uid).value,
    put(rNodeCreate(nodeId, node)),
    '4x. Create sketch node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeInputUpdate', (t) => {
  const inputId = 'AUDIO_0'
  const nodeId = 'XXX'

  const generator = nodeInputUpdate({
    payload: { nodeId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getNodeInputId, nodeId),
    '1. Get old input ID'
  )

  const oldInputId = 'YYY'

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedNodeDelete(oldInputId, nodeId)),
    '2. Delete node assigned to old input'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedNodeCreate(inputId, nodeId)),
    '3. Create assigned node for new input'
  )

  t.deepEqual(
    generator.next().value,
    put(rNodeInputUpdate(nodeId, { id: inputId })),
    '4. Update input in node with new ID'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeInputUpdate - midi', (t) => {
  const inputId = 'midi'
  const nodeId = 'XXX'

  const generator = nodeInputUpdate({
    payload: { nodeId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getNodeInputId, nodeId),
    '1. Get old input ID'
  )

  const oldInputId = 'YYY'

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedNodeDelete(oldInputId, nodeId)),
    '2. Delete node assigned to old input'
  )

  t.deepEqual(
    generator.next().value,
    put(midiStartLearning(nodeId)),
    '3. Start Midi Learn'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeInputUpdate - old input false', (t) => {
  const inputId = 'AUDIO_0'
  const nodeId = 'XXX'

  const generator = nodeInputUpdate({
    payload: { nodeId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getNodeInputId, nodeId),
    '1. Get old input ID'
  )

  const oldInputId = false

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedNodeCreate(inputId, nodeId)),
    '2. Create assigned node for new input'
  )

  t.deepEqual(
    generator.next().value,
    put(rNodeInputUpdate(nodeId, { id: inputId })),
    '3. Update input in node with new ID'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
