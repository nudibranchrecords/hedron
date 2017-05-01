import test from 'tape'
import { getInfoText } from '../selectors'
import deepFreeze from 'deep-freeze'

test('(Selector) getInfoText - "Learning MIDI"', (t) => {
  const state = {
    nodes: {
      xxx: {

      }
    },
    midi: {
      learning: 'xxx'
    }
  }

  deepFreeze(state)

  const actual = getInfoText(state, 'xxx')
  t.equal(actual, 'Learning MIDI')
  t.end()
})

test('(Selector) getInfoText - MIDI info', (t) => {
  const state = {
    midi: {
      learning: false
    },
    nodes: {
      xxx: {
        input: {
          type: 'midi',
          info: 'foo'
        }
      }
    }
  }

  deepFreeze(state)

  const actual = getInfoText(state, 'xxx')
  t.equal(actual, 'foo')
  t.end()
})
