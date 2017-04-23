import 'babel-polyfill'
import test from 'tape'
import sinon from 'sinon'

import { select, takeEvery, put, call } from 'redux-saga/effects'

import proxyquire from 'proxyquire'

import { getAssignedParams } from '../selectors'
import { paramValueUpdate } from '../../params/actions'
import { projectError } from '../../project/actions'

import getParams from '../../../selectors/getParams'

proxyquire.noCallThru()

const modifiers = {
  work: sinon.stub()
}

const { watchInputs, handleInput } = proxyquire('../sagas', { modifiers })

test('(Saga) watchInputs', (t) => {
  const generator = watchInputs()
  t.deepEqual(
    generator.next().value,
    takeEvery('INPUT_FIRED', handleInput)
  )
  t.end()
})

test('(Saga) handleInput (no modifiers)', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.2,
      inputId: 'audio_0'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedParams, 'audio_0'),
    '1. Gets assigned params'
  )

  const params = [
    {
      id: 'XX'
    },
    {
      id: 'YY'
    }
  ]

  t.deepEqual(
    generator.next(params).value,
    put(paramValueUpdate('XX', 0.2)),
    '2.x Dispatches param update action'
  )

  t.deepEqual(
    generator.next(params).value,
    put(paramValueUpdate('YY', 0.2)),
    '2.x Dispatches param update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})

test('(Saga) handleInput (modifiers)', (t) => {
  let modifiedValue, modifierParams

  const generator = handleInput({
    payload: {
      value: 0.2,
      inputId: 'audio_0'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedParams, 'audio_0'),
    '1. Gets assigned params'
  )

  const params = [
    {
      id: 'XX',
      modifierIds: ['yyy', 'zzz']
    }
  ]

  t.deepEqual(
    generator.next(params).value,
    select(getParams, ['yyy', 'zzz']),
    '2.x Get Modifiers (params)'
  )

  modifierParams = [
    {
      id: 'yyy',
      key: 'foo',
      value: 0.5
    },
    {
      id: 'zzz',
      key: 'bar',
      value: 0.7
    }
  ]

  t.deepEqual(
    generator.next(modifierParams).value,
    call(modifiers.work, 'foo', 0.5, 0.2),
    '2.x get value after going through first modifier'
  )

  modifiedValue = 0.1

  t.deepEqual(
    generator.next(modifiedValue).value,
    call(modifiers.work, 'bar', 0.7, 0.1),
    '2.x get value after going through second modifier'
  )

  modifiedValue = 0.9

  t.deepEqual(
    generator.next(modifiedValue).value,
    put(paramValueUpdate('XX', 0.9)),
    '2.x Dispatches param update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})
