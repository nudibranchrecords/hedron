import 'babel-polyfill'
import test from 'tape'
import { select, takeEvery, put, call } from 'redux-saga/effects'

import { getParamInputId, getDefaultModifierIds } from '../selectors'
import { rParamInputUpdate, rParamCreate } from '../actions'
import { inputAssignedParamDelete, inputAssignedParamCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'
import uid from 'uid'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

proxyquire.noCallThru()

const getAllModifiers = sinon.stub()
const { watchParams, paramInputUpdate, paramCreate } = proxyquire('../sagas', {
  'modifiers': getAllModifiers
})

test('(Saga) watchParams', (t) => {
  const generator = watchParams()
  t.deepEqual(
    generator.next().value,
    takeEvery('U_PARAM_INPUT_UPDATE', paramInputUpdate)
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('U_PARAM_CREATE', paramCreate)
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) paramCreate - sketch param', (t) => {
  const paramId = 'XXX'
  const param = { foo: 'bar' }
  let modifier, uniqueId

  const generator = paramCreate({
    payload: { id: paramId, param }
  })

  t.deepEqual(
    generator.next(defaults).value,
    call(getAllModifiers),
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
    key: 'foo',
    title: 'Fooey',
    value: 0.2
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rParamCreate(uniqueId, modifier)),
    '4x. Create param (modifier)'
  )

  t.deepEqual(
    generator.next(defaults).value,
    call(uid),
    '3x. Generate unique ID for modifier'
  )

  uniqueId = 'yyy'
  modifier = {
    key: 'bar',
    title: 'Barey',
    value: 0.5
  }

  t.deepEqual(
    generator.next(uniqueId).value,
    put(rParamCreate(uniqueId, modifier)),
    '4x. Create param (modifier)'
  )

  param.modifierIds = ['xxx', 'yyy']

  t.deepEqual(
    generator.next(uid).value,
    put(rParamCreate(paramId, param)),
    '4x. Create sketch param'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) paramInputUpdate', (t) => {
  const inputId = 'AUDIO_0'
  const paramId = 'XXX'

  const generator = paramInputUpdate({
    payload: { paramId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getParamInputId, paramId),
    '1. Get old input ID'
  )

  const oldInputId = 'YYY'

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedParamDelete(oldInputId, paramId)),
    '2. Delete param assigned to old input'
  )

  t.deepEqual(
    generator.next().value,
    put(inputAssignedParamCreate(inputId, paramId)),
    '3. Create assigned param for new input'
  )

  t.deepEqual(
    generator.next().value,
    put(rParamInputUpdate(paramId, { id: inputId })),
    '4. Update input in param with new ID'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) paramInputUpdate - midi', (t) => {
  const inputId = 'midi'
  const paramId = 'XXX'

  const generator = paramInputUpdate({
    payload: { paramId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getParamInputId, paramId),
    '1. Get old input ID'
  )

  const oldInputId = 'YYY'

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedParamDelete(oldInputId, paramId)),
    '2. Delete param assigned to old input'
  )

  t.deepEqual(
    generator.next().value,
    put(midiStartLearning(paramId)),
    '3. Start Midi Learn'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) paramInputUpdate - old input false', (t) => {
  const inputId = 'AUDIO_0'
  const paramId = 'XXX'

  const generator = paramInputUpdate({
    payload: { paramId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getParamInputId, paramId),
    '1. Get old input ID'
  )

  const oldInputId = false

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedParamCreate(inputId, paramId)),
    '2. Create assigned param for new input'
  )

  t.deepEqual(
    generator.next().value,
    put(rParamInputUpdate(paramId, { id: inputId })),
    '3. Update input in param with new ID'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) paramInputUpdate - new input "none"', (t) => {
  const inputId = 'none'
  const paramId = 'XXX'

  const generator = paramInputUpdate({
    payload: { paramId, inputId }
  })

  t.deepEqual(
    generator.next().value,
    select(getParamInputId, paramId),
    '1. Get old input ID'
  )

  const oldInputId = 'audio_0'

  t.deepEqual(
    generator.next(oldInputId).value,
    put(inputAssignedParamDelete(oldInputId, paramId)),
    '2. Delete param assigned to old input'
  )

  t.deepEqual(
    generator.next().value,
    put(rParamInputUpdate(paramId, false)),
    '3. Update input in param with false'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
