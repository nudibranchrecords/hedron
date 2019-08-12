import test from 'tape'
import getInputLinkLfoOptionIds from '../getInputLinkLfoOptionIds'

test('(Selector) getInputLinkLfoOptionIds (input is not "lfo")', (t) => {
  const state = {
    nodes: {
      aaa: {
        input: {
          id: 'BAR',
        },
        lfoOptionIds: [],
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'aaa')

  t.deepEqual(actual, [], 'Returns empty array')
  t.end()
})

test('(Selector) getInputLinkLfoOptionIds (input is "lfo", shape is NOT "noise")', (t) => {
  const state = {
    nodes: {
      aaa: {
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['xxx', 'yyy', 'zzz'],
      },
      xxx: {
        key: 'seed',
      },
      yyy: {
        key: 'rate',
      },
      zzz: {
        key: 'shape',
        value: 'sine',
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'aaa')

  t.deepEqual(actual, ['yyy', 'zzz'], 'Returns options ids array, omitting "seed"')
  t.end()
})
test('(Selector) getInputLinkLfoOptionIds (input is "lfo", shape is "noise")', (t) => {
  const state = {
    nodes: {
      aaa: {
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['xxx', 'yyy', 'zzz'],
      },
      xxx: {
        key: 'seed',
      },
      yyy: {
        key: 'rate',
      },
      zzz: {
        key: 'shape',
        value: 'noise',
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'aaa')

  t.deepEqual(actual, ['xxx', 'yyy', 'zzz'], 'Returns options ids array, including "seed"')
  t.end()
})

test('(Selector) getInputLinkLfoOptionIds (input is "lfo", link type "shot", wave shape is NOT "noise")', (t) => {
  const state = {
    nodes: {
      aaa: {
        nodeType: 'shot',
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['xxx', 'yyy', 'zzz'],
      },
      xxx: {
        key: 'seed',
      },
      yyy: {
        key: 'rate',
      },
      zzz: {
        key: 'shape',
        value: 'sine',
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'aaa')

  t.deepEqual(actual, ['yyy'], 'Only returns rate ID')
  t.end()
})

test('(Selector) getInputLinkLfoOptionIds (input is "lfo", link type "shot", wave shape is "noise")', (t) => {
  const state = {
    nodes: {
      aaa: {
        nodeType: 'shot',
        input: {
          id: 'lfo',
        },
        lfoOptionIds: ['xxx', 'yyy', 'zzz'],
      },
      xxx: {
        key: 'seed',
      },
      yyy: {
        key: 'rate',
      },
      zzz: {
        key: 'shape',
        value: 'noise',
      },
    },
  }

  const actual = getInputLinkLfoOptionIds(state, 'aaa')

  t.deepEqual(actual, ['xxx', 'yyy'], 'Only returns rate ID and noise ID')
  t.end()
})
