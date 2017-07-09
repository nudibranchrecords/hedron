import 'babel-polyfill'
import test from 'tape'
import sinon from 'sinon'

import { select, takeEvery, put, call } from 'redux-saga/effects'

import proxyquire from 'proxyquire'

import { getAssignedLinks } from '../selectors'
import { nodeValueUpdate } from '../../nodes/actions'
import { inputLinkShotFired, inputLinkShotDisarm, inputLinkShotArm } from '../../inputLinks/actions'
import { projectError } from '../../project/actions'

import getNodes from '../../../selectors/getNodes'
import getNodesValues from '../../../selectors/getNodesValues'
import getNode from '../../../selectors/getNode'
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
    select(getAssignedLinks, 'audio_0'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX'
    },
    {
      nodeId: 'YY'
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    put(nodeValueUpdate('XX', 0.2)),
    '2.x Dispatches node update action'
  )

  t.deepEqual(
    generator.next(links).value,
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
      inputId: 'audio_0',
      type: 'audio'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'audio_0'),
    '1. Gets assigned links'
  )

  const nodes = [
    {
      nodeId: 'XX',
      modifierIds: ['yyy', 'zzz', 'aa1', 'aa2']
    }
  ]

  t.deepEqual(
    generator.next(nodes).value,
    select(getNodes, ['yyy', 'zzz', 'aa1', 'aa2']),
    '2.x Get Modifiers (nodes)'
  )

  modifierNodes = [
    {
      id: 'yyy',
      key: 'foo',
      value: 0.5,
      passToNext: false,
      type: 'audio'
    },
    {
      id: 'zzz',
      key: 'bar',
      passToNext: false,
      value: 0.7
    },
    {
      id: 'zzz',
      key: 'bar',
      passToNext: true,
      value: 0.2
    },
    {
      id: 'zzz',
      key: 'bar',
      passToNext: false,
      value: 0.3
    }
  ]

  t.deepEqual(
    generator.next(modifierNodes).value,
    call(modifiers.work, 'foo', [0.5], 0.2),
    '2.x get value after going through first modifier'
  )

  modifiedValue = 0.1

  t.deepEqual(
    generator.next(modifiedValue).value,
    call(modifiers.work, 'bar', [0.7], 0.1),
    '2.x get value after going through second modifier'
  )

  modifiedValue = 0.9

  t.deepEqual(
    generator.next(modifiedValue).value,
    call(modifiers.work, 'bar', [0.2, 0.3], 0.9),
    '2.x work modifier with multiple values'
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

test('(Saga) handleInput (ignore audio type modifiers)', (t) => {
  let modifiedValue, modifierNodes

  const generator = handleInput({
    payload: {
      value: 0.2,
      inputId: 'midi_xxx'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      modifierIds: ['yyy', 'zzz']
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNodes, ['yyy', 'zzz']),
    '2.x Get Modifiers (nodes)'
  )

  modifierNodes = [
    {
      id: 'yyy',
      key: 'foo',
      value: 0.5,
      type: 'audio'
    },
    {
      id: 'zzz',
      key: 'bar',
      value: 0.7
    }
  ]

  t.deepEqual(
    generator.next(modifierNodes).value,
    call(modifiers.work, 'bar', [0.7], 0.2),
    '2.x ignore first modifier, get second'
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
    select(getAssignedLinks, 'lfo'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      lfoOptionIds: ['yyy', 'zzz']
    }
  ]

  t.deepEqual(
    generator.next(links).value,
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
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      nodeType: 'select'
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
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

  t.deepEqual(
    generator.next(node).value,
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

test('(Saga) handleInput (shot - noteOn)', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.5,
      inputId: 'midi_xxx',
      type: 'noteOn'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      nodeType: 'shot'
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
    sketchId: 'fooSketch',
    method: 'barMethod'
  }

  t.deepEqual(
    generator.next(node).value,
    put(inputLinkShotFired('fooSketch', 'barMethod')),
    '4. Dispatches node shot fired action'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('XX', 0.5)),
    '5. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is over 0.5, armed)', (t) => {
  const generator = handleInput({
    payload: {
      value: 1,
      inputId: 'audio_1',
      type: 'audio'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'audio_1'),
    '1. Gets assigned nodes'
  )

  const links = [
    {
      id: 'LINK1',
      nodeId: 'XX',
      nodeType: 'shot',
      armed: true
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
    sketchId: 'fooSketch',
    method: 'barMethod'
  }

  t.deepEqual(
    generator.next(node).value,
    put(inputLinkShotFired('fooSketch', 'barMethod')),
    '4. Dispatches input link shot fired action'
  )

  t.deepEqual(
    generator.next().value,
    put(inputLinkShotDisarm('LINK1')),
    '5. Dispatches input link disarm action'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('XX', 1)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is over 0.5, disarmed)', (t) => {
  const generator = handleInput({
    payload: {
      value: 1,
      inputId: 'audio_1',
      type: 'audio'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'audio_1'),
    '1. Gets assigned links'
  )

  const links = [
    {
      id: 'LINK1',
      nodeId: 'XX',
      nodeType: 'shot',
      armed: false
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
    sketchId: 'fooSketch',
    method: 'barMethod'
  }

  t.deepEqual(
    generator.next(node).value,
    put(nodeValueUpdate('XX', 1)),
    '2. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is under 0.5, armed)', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.4,
      inputId: 'audio_1',
      type: 'audio'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'audio_1'),
    '1. Gets assigned nodes'
  )

  const links = [
    {
      id: 'LINK1',
      nodeId: 'XX',
      nodeType: 'shot',
      armed: true
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
    sketchId: 'fooSketch',
    method: 'barMethod'
  }

  t.deepEqual(
    generator.next(node).value,
    put(inputLinkShotArm('LINK1')),
    '5. Dispatches input link arm action'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('XX', 0.4)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is under 0.5, disarmed)', (t) => {
  const generator = handleInput({
    payload: {
      value: 0.4,
      inputId: 'audio_1',
      type: 'audio'
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getAssignedLinks, 'audio_1'),
    '1. Gets assigned links'
  )

  const links = [
    {
      id: 'LINK1',
      nodeId: 'XX',
      nodeType: 'shot',
      armed: false
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getNode, 'XX'),
    '1.1 Get node'
  )

  const node = {
    sketchId: 'fooSketch',
    method: 'barMethod'
  }

  t.deepEqual(
    generator.next(node).value,
    put(inputLinkShotArm('LINK1')),
    '5. Dispatches input link arm action'
  )

  t.deepEqual(
    generator.next().value,
    put(nodeValueUpdate('XX', 0.4)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})
