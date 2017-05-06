import test from 'tape'
import getNodeLfoOptionIds from '../getNodeLfoOptionIds'

test('(Selector) getNodeLfoOptionIds (input is not "lfo")', (t) => {
  const state = {
    nodes: {
      xxx: {
        input: {
          id: 'BAR'
        }
      }
    }
  }

  const actual = getNodeLfoOptionIds(state, 'xxx')

  t.equal(actual, false, 'Returns false')
  t.end()
})

test('(Selector) getNodeLfoOptionIds (input is "lfo")', (t) => {
  const state = {
    nodes: {
      xxx: {
        input: {
          id: 'lfo'
        },
        lfoOptionIds: ['yyy', 'zzz']
      }
    }
  }

  const actual = getNodeLfoOptionIds(state, 'xxx')

  t.deepEqual(actual, ['yyy', 'zzz'], 'Returns options ids array')
  t.end()
})
