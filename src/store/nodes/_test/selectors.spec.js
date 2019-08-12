import test from 'tape'
import { getNodeInputId, getDefaultModifierIds } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getNodeInputId', (t) => {
  const state = {
    nodes: {
      XXX: {
        input: {
          id: 'audio_0',
        },
      },
    },
  }
  deepFreeze(state)

  const actual = getNodeInputId(state, 'XXX')

  t.deepEqual(actual, 'audio_0', 'Returns input id')
  t.end()
})

test('(Selector) project - getNodeInputId (no input)', (t) => {
  const state = {
    nodes: {
      XXX: {
        input: false,
      },
    },
  }
  deepFreeze(state)

  const actual = getNodeInputId(state, 'XXX')

  t.equal(actual, false, 'Returns false')
  t.end()
})

test('(Selector) project - getDefaultModifierIds (no input)', (t) => {
  const state = {}
  deepFreeze(state)

  const actual = getDefaultModifierIds(state)

  t.deepEqual(actual, ['threshold', 'gain', 'range'], 'Returns list of modifier ids')
  t.end()
})
