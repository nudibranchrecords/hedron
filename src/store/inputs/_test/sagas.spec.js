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
import getLinkableAction from '../../../selectors/getLinkableAction'
import getCurrentBankIndex from '../../../selectors/getCurrentBankIndex'
import lfoProcess from '../../../utils/lfoProcess'
import midiValueProcess from '../../../utils/midiValueProcess'
import debounceInput from '../../../utils/debounceInput'

proxyquire.noCallThru()

const modifiers = {
  work: sinon.stub()
}

const { watchInputs, handleInput } = proxyquire('../sagas', {
  '../../externals/modifiers': {
    work: modifiers.work
  }
})

test('(Saga) watchInputs', (t) => {
  const generator = watchInputs()
  t.deepEqual(
    generator.next().value,
    takeEvery('INPUT_FIRED', handleInput)
  )
  t.end()
})

const payload = {
  value: 0.2,
  inputId: 'audio_0'
}

test('(Saga) handleInput (no modifiers)', (t) => {
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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

  const payload = {
    value: 0.2,
    inputId: 'audio_0',
    type: 'audio'
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
  const payload = {
    value: 0.2,
    inputId: 'midi_xxx'
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
  const payload = {
    value: 0.555,
    inputId: 'lfo'
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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

test('(Saga) handleInput (shot - noteOn)', (t) => {
  const meta = { 'noteOn': true }
  const payload = {
    value: 0.5,
    inputId: 'midi_xxx',
    meta
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
    put(nodeValueUpdate('XX', 0.5, meta)),
    '5. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (macro - noteOn)', (t) => {
  const meta = { 'noteOn': true }
  const payload = {
    value: 0.5,
    inputId: 'midi_xxx',
    meta
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      nodeType: 'macro'
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    put(nodeValueUpdate('XX', 1, meta)),
    '5. Dispatches node update action with value of 1'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - seq-step sequencer - not in sequence)', (t) => {
  const payload = {
    value: 12,
    inputId: 'seq-step'
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
    select(getAssignedLinks, 'seq-step'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      nodeType: 'shot',
      sequencerGridId: 'SEQ01'
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
    select(getNode, 'SEQ01'),
    '2 Get node for sequencer grid'
  )

  const seqNode = {
    value: [
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1 // index 12 is "0"
    ]
  }

  t.equal(generator.next(seqNode).done, true, 'generator ends (doesnt update node)')

  t.end()
})

test('(Saga) handleInput (shot - seq-step sequencer - in sequence)', (t) => {
  const payload = {
    value: 5,
    inputId: 'seq-step'
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
    select(getAssignedLinks, 'seq-step'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      nodeType: 'shot',
      sequencerGridId: 'SEQ01'
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
    select(getNode, 'SEQ01'),
    '2 Get node for sequencer grid'
  )

  const seqNode = {
    value: [
      1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1 // index 5 is "1"
    ]
  }

  t.deepEqual(
    generator.next(seqNode).value,
    put(inputLinkShotFired('fooSketch', 'barMethod')),
    '4. Dispatches node shot fired action'
  )

  t.equal(generator.next().done, true, 'generator ends (doesnt update node)')

  t.end()
})

test('(Saga) handleInput (midi - banks)', (t) => {
  let bankIndex
  const meta = { type: 'midi' }
  const payload = {
    value: 0.5,
    inputId: 'midi_xxx',
    meta
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 5

  t.deepEqual(
    generator.next(messageCount).value,
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      nodeId: 'XX',
      deviceId: 'D1',
      bankIndex: 1
    },
    {
      nodeId: 'YY',
      deviceId: 'D2',
      bankIndex: 2,
      midiOptionIds: ['MIDI1']
    },
    {
      nodeId: 'ZZ',
      deviceId: 'D3',
      bankIndex: 3
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getCurrentBankIndex, 'D1'),
    'Gets current bank index for device D1'
  )

  bankIndex = 100

  t.deepEqual(
    generator.next(bankIndex).value,
    select(getCurrentBankIndex, 'D2'),
    'Gets current bank index for device D2'
  )

  bankIndex = 2

  t.deepEqual(
    generator.next(bankIndex).value,
    select(getNode, 'YY'),
    'Gets node because matches with current bank'
  )

  const node = {
    value: 0.7
  }

  t.deepEqual(
    generator.next(node).value,
    select(getNodesValues, ['MIDI1']),
    'Get midi option nodes'
  )

  const midiOptionNodes = {
    sensitity: 0.11
  }

  t.deepEqual(
    generator.next(midiOptionNodes).value,
    call(midiValueProcess, 0.7, 0.5, messageCount, 0.11, node),
    'Calls midiValueProcess using nodeValue, midi action value and number of messages'
  )

  const val = 0.75

  t.deepEqual(
    generator.next(val).value,
    put(nodeValueUpdate('YY', val, meta)),
    'Dispatches node update action with newly generated value'
  )

  t.deepEqual(
    generator.next(bankIndex).value,
    select(getCurrentBankIndex, 'D3'),
    'Gets current bank index for device D3'
  )

  bankIndex = 1

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is over 0.5, armed)', (t) => {
  const meta = { type: 'audio' }
  const payload = {
    value: 1,
    inputId: 'audio_1',
    meta
  }

  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
    put(nodeValueUpdate('XX', 1, meta)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is over 0.5, disarmed)', (t) => {
  const meta = { type: 'audio' }
  const payload = {
    value: 1,
    inputId: 'audio_1',
    meta
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
    put(nodeValueUpdate('XX', 1, meta)),
    '2. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is under 0.5, armed)', (t) => {
  const meta = { type: 'audio' }
  const payload = {
    value: 0.4,
    inputId: 'audio_1',
    meta
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
    put(nodeValueUpdate('XX', 0.4, meta)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput (shot - audio val is under 0.5, disarmed)', (t) => {
  const meta = { type: 'audio' }
  const payload = {
    value: 0.4,
    inputId: 'audio_1',
    meta
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
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
    put(nodeValueUpdate('XX', 0.4, meta)),
    '6. Dispatches node update action'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})

test('(Saga) handleInput - linkType is "linkableAction"', (t) => {
  const meta = { type: 'midi' }
  const payload = {
    value: 0.4,
    inputId: 'midi_xxx',
    meta
  }
  const generator = handleInput({
    payload
  })

  t.deepEqual(
    generator.next().value,
    call(debounceInput, payload),
    '0. Call debounceInput'
  )

  const messageCount = 1

  t.deepEqual(
    generator.next(messageCount).value,
    select(getAssignedLinks, 'midi_xxx'),
    '1. Gets assigned links'
  )

  const links = [
    {
      id: 'LINK1',
      nodeId: 'NN',
      linkType: 'linkableAction'
    }
  ]

  t.deepEqual(
    generator.next(links).value,
    select(getLinkableAction, 'NN'),
    '1.1 Get linkableAction'
  )

  const linkableAction = {
    action: { foo: 'bar' }
  }

  t.deepEqual(
    generator.next(linkableAction).value,
    put({ foo: 'bar' }),
    '6. Dispatch action from linkableAction'
  )

  t.equal(generator.next().done, true, 'generator ends')

  t.end()
})
