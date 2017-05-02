import 'babel-polyfill'
import test from 'tape'
import sinon from 'sinon'

import { select, takeEvery, put, call } from 'redux-saga/effects'

import proxyquire from 'proxyquire'

import { getAssignedNodes } from '../selectors'
import { nodeValueUpdate } from '../../nodes/actions'
import { projectError } from '../../project/actions'

import getNodes from '../../../selectors/getNodes'
import getNodesValues from '../../../selectors/getNodesValues'
import lfoProcess from '../../../utils/lfoProcess'

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
    select(getAssignedNodes, 'audio_0'),
    '1. Gets assigned nodes'
  )

  const nodes = [
    {
      id: 'XX'
    },
    {
      id: 'YY'
    }
  ]

  t.deepEqual(
    generator.next(nodes).value,
    put(nodeValueUpdate('XX', 0.2)),
    '2.x Dispatches node update action'
  )

  t.deepEqual(
    generator.next(nodes).value,
    put(nodeValueUpdate('YY', 0.2)),
    '2.x Dispatches node update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})

test('(Saga) handleInput (modifiers)', (t) => {
  let modifiedValue, modifierNodes

  const generator = handleInput({
    payload: {
      value: 0.2,
      inputId: 'audio_0'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedNodes, 'audio_0'),
    '1. Gets assigned nodes'
  )

  const nodes = [
    {
      id: 'XX',
      modifierIds: ['yyy', 'zzz']
    }
  ]

  t.deepEqual(
    generator.next(nodes).value,
    select(getNodes, ['yyy', 'zzz']),
    '2.x Get Modifiers (nodes)'
  )

  modifierNodes = [
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
    generator.next(modifierNodes).value,
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
    put(nodeValueUpdate('XX', 0.9)),
    '2.x Dispatches node update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})

test('(Saga) handleInput (lfo)', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.555,
      inputId: 'lfo'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedNodes, 'lfo'),
    '1. Gets assigned nodes'
  )

  const nodes = [
    {
      id: 'XX',
      lfoOptionIds: ['yyy', 'zzz']
    }
  ]

  t.deepEqual(
    generator.next(nodes).value,
    select(getNodesValues, ['yyy', 'zzz']),
    '2 Get Options values (nodes)'
  )

  const optionValues = {
    shape: 'sine',
    rate: 2
  }

  t.deepEqual(
    generator.next(optionValues).value,
    call(lfoProcess, 0.555, 'sine', 2),
    '3. get value after going through first modifier'
  )

  const lfoValue = 0.9

  t.deepEqual(
    generator.next(lfoValue).value,
    put(nodeValueUpdate('XX', 0.9)),
    '4. Dispatches node update action'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})

test('(Saga) handleInput (select node)', (t) => {
  const generator = handleInput({
    payload: {
      inputId: 'midi_xxx',
      value: 0.34
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedNodes, 'midi_xxx'),
    '1. Gets assigned nodes'
  )

  const nodes = [
    {
      id: 'XX',
      type: 'select',
      options: [
        { value: 'one' },
        { value: 'two' },
        { value: 'three' },
        { value: 'four' },
        { value: 'five' },
        { value: 'six' },
        { value: 'seven' },
        { value: 'eight' },
        { value: 'nine' },
        { value: 'ten' }
      ]
    }
  ]

  t.deepEqual(
    generator.next(nodes).value,
    put(nodeValueUpdate('XX', 'four')),
    '2. Dispatches node update action, converting value to option'
  )

  t.deepEqual(
    generator.throw({ message: 'Error!' }).value,
    put(projectError('Error!')),
    'Dispatches project error if some error'
  )

  t.end()
})
