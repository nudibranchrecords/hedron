import test from 'tape'
import getParamInfoText from '../getParamInfoText'
import deepFreeze from 'deep-freeze'

test('(Selector) getInfoText - "Learning MIDI"', (t) => {
  const state = {
    nodes: {
      xxx: {

      },
    },
    midi: {
      learning: 'xxx',
    },
  }

  deepFreeze(state)

  const actual = getParamInfoText(state, 'xxx')
  t.equal(actual, 'Learning MIDI')
  t.end()
})

test('(Selector) getInfoText - MIDI info', (t) => {
  const state = {
    midi: {
      learning: false,
    },
    nodes: {
      xxx: {
        inputLinkIds: ['aaa', 'bbb'],
      },
    },
    inputLinks: {
      aaa: {
        title: 'midi_x',
      },
      bbb: {
        title: 'midi_y',
      },
    },
  }

  deepFreeze(state)

  const actual = getParamInfoText(state, 'xxx')
  t.equal(actual, 'midi_x, midi_y')
  t.end()
})
