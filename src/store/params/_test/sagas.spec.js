import 'babel-polyfill'
import test from 'tape'
import { select, takeEvery, put } from 'redux-saga/effects'
import { watchParams, paramInputUpdate } from '../sagas'
import { getParamInputId } from '../selectors'
import { rParamInputUpdate } from '../actions'
import { inputAssignedParamDelete, inputAssignedParamCreate } from '../../inputs/actions'
import { midiStartLearning } from '../../midi/actions'

test('(Saga) watchParams', (t) => {
  const generator = watchParams()
  t.deepEqual(
    generator.next().value,
    takeEvery('U_PARAM_INPUT_UPDATE', paramInputUpdate)
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
