import '@babel/polyfill'
import test from 'tape'
import { select, put } from 'redux-saga/effects'
import getNode from '../../../selectors/getNode'
import { rNodeCreate, rNodeDelete } from '../actions'
import { uInputLinkDelete } from '../../inputLinks/actions'
import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAll = sinon.stub()
const { nodeCreate, nodeDelete } = proxyquire('../sagas', {
  'modifiers': { getAll },
})

test('(Saga) nodeCreate - param node', (t) => {
  const nodeId = 'XXX'
  const node = { foo: 'bar' }

  const generator = nodeCreate({
    payload: { id: nodeId, node },
  })

  t.deepEqual(
    generator.next(uid).value,
    put(rNodeCreate(nodeId, node)),
    '4x. Create param node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeDelete (no inputLinks)', (t) => {
  const nodeId = 'XXX'

  const generator = nodeDelete({
    payload: { nodeId },
  })

  t.deepEqual(
    generator.next().value,
    select(getNode, nodeId),
    '1. Get node'
  )

  const node = {
    id: 'XXX',
    inputLinksIds: [],
  }

  t.deepEqual(
    generator.next(node).value,
    put(rNodeDelete(nodeId)),
    '2. Delete node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) nodeDelete (has inputlinks)', (t) => {
  const nodeId = 'XXX'

  const generator = nodeDelete({
    payload: { nodeId },
  })

  t.deepEqual(
    generator.next().value,
    select(getNode, nodeId),
    '1. Get node'
  )

  const node = {
    id: 'XXX',
    inputLinkIds: ['l1', 'l2'],
  }

  t.deepEqual(
    generator.next(node).value,
    put(uInputLinkDelete('l1')),
    '2. Delete input link'
  )

  t.deepEqual(
    generator.next(node).value,
    put(uInputLinkDelete('l2')),
    '3. Delete input link'
  )

  t.deepEqual(
    generator.next().value,
    put(rNodeDelete(nodeId)),
    '3. Delete node'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
//
// test('(Saga) nodeInputUpdate', (t) => {
//   const inputId = 'AUDIO_0'
//   const nodeId = 'XXX'
//   const inputType = 'audio'
//
//   const generator = nodeInputUpdate({
//     payload: { nodeId, inputId, inputType }
//   })
//
//   t.deepEqual(
//     generator.next().value,
//     select(getNodeInputId, nodeId),
//     '1. Get old input ID'
//   )
//
//   const oldInputId = 'YYY'
//
//   t.deepEqual(
//     generator.next(oldInputId).value,
//     put(inputAssignedNodeDelete(oldInputId, nodeId)),
//     '2. Delete node assigned to old input'
//   )
//
//   t.deepEqual(
//     generator.next().value,
//     put(inputAssignedNodeCreate(inputId, nodeId)),
//     '3. Create assigned node for new input'
//   )
//
//   t.deepEqual(
//     generator.next().value,
//     put(rNodeInputUpdate(nodeId, { id: inputId, type: inputType })),
//     '4. Update input in node with new ID'
//   )
//
//   t.equal(generator.next().done, true, 'Generator ends')
//   t.end()
// })
//
// test('(Saga) nodeInputUpdate - midi', (t) => {
//   const inputId = 'midi'
//   const nodeId = 'XXX'
//
//   const generator = nodeInputUpdate({
//     payload: { nodeId, inputId }
//   })
//
//   t.deepEqual(
//     generator.next().value,
//     select(getNodeInputId, nodeId),
//     '1. Get old input ID'
//   )
//
//   const oldInputId = 'YYY'
//
//   t.deepEqual(
//     generator.next(oldInputId).value,
//     put(inputAssignedNodeDelete(oldInputId, nodeId)),
//     '2. Delete node assigned to old input'
//   )
//
//   t.deepEqual(
//     generator.next().value,
//     put(midiStartLearning(nodeId)),
//     '3. Start Midi Learn'
//   )
//
//   t.equal(generator.next().done, true, 'Generator ends')
//   t.end()
// })
//
// test('(Saga) nodeInputUpdate - old input false', (t) => {
//   const inputId = 'AUDIO_0'
//   const inputType = 'audio'
//   const nodeId = 'XXX'
//
//   const generator = nodeInputUpdate({
//     payload: { nodeId, inputId, inputType }
//   })
//
//   t.deepEqual(
//     generator.next().value,
//     select(getNodeInputId, nodeId),
//     '1. Get old input ID'
//   )
//
//   const oldInputId = false
//
//   t.deepEqual(
//     generator.next(oldInputId).value,
//     put(inputAssignedNodeCreate(inputId, nodeId)),
//     '2. Create assigned node for new input'
//   )
//
//   t.deepEqual(
//     generator.next().value,
//     put(rNodeInputUpdate(nodeId, { id: inputId, type: inputType })),
//     '3. Update input in node with new ID'
//   )
//
//   t.equal(generator.next().done, true, 'Generator ends')
//   t.end()
// })
