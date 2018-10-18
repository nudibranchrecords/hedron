import test from 'tape'
import getInputLinkLfoOptionIds from '../getInputLinkLfoOptionIds'

test('(Selector) getInputLinkLfoOptionIds (input is not "lfo")', (t) => {
  const state = {
    inputLinks: {
      xxx: {
        input: {
          id: 'BAR',
        },
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'xxx')

  t.equal(actual, undefined, 'Returns undefined')
  t.end()
})

test('(Selector) getInputLinkLfoOptionIds (input is "lfo")', (t) => {
  const state = {
    inputLinks: {
      xxx: {
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['yyy', 'zzz'],
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'xxx')

  t.deepEqual(actual, ['yyy', 'zzz'], 'Returns options ids array')
  t.end()
})

test('(Selector) getInputLinkLfoOptionIds (input is "lfo", link type "shot")', (t) => {
  const state = {
    inputLinks: {
      xxx: {
        nodeType: 'shot',
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['yyy', 'zzz'],
      },
    },
    nodes: {
      yyy: {
        key: 'rate',
      },
      zzz: {
        key: 'shape',
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'xxx')

  t.deepEqual(actual, ['yyy'], 'Only returns rate ID')
  t.end()
})
