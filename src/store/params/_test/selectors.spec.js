import test from 'tape'
import { getParamInputId, getDefaultModifierIds } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) project - getParamInputId', (t) => {
  const state = {
    params: {
      XXX: {
        input: {
          id: 'audio_0'
        }
      }
    }
  }
  deepFreeze(state)

  const actual = getParamInputId(state, 'XXX')

  t.deepEqual(actual, 'audio_0', 'Returns input id')
  t.end()
})

test('(Selector) project - getParamInputId (no input)', (t) => {
  const state = {
    params: {
      XXX: {
        input: false
      }
    }
  }
  deepFreeze(state)

  const actual = getParamInputId(state, 'XXX')

  t.equal(actual, false, 'Returns false')
  t.end()
})

test('(Selector) project - getDefaultModifierIds (no input)', (t) => {
  const state = {}
  deepFreeze(state)

  const actual = getDefaultModifierIds(state)

  t.deepEqual(actual, ['gain', 'lowerRange'], 'Returns list of modifier ids')
  t.end()
})
