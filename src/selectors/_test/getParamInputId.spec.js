import test from 'tape'
import getParamInputId from '../getParamInputId'

test('(Selector) getParamInputId (normal)', (t) => {
  const state = {
    params: {
      xxx: {
        input: {
          id: 'YYY'
        }
      }
    }
  }

  const actual = getParamInputId(state, 'xxx')

  t.equal(actual, 'YYY', 'Returns id')
  t.end()
})

test('(Selector) getParamInputId (false)', (t) => {
  const state = {
    params: {
      xxx: {
        input: false
      }
    }
  }

  const actual = getParamInputId(state, 'xxx')

  t.equal(actual, false, 'Returns false')
  t.end()
})

test('(Selector) getParamInputId (midi)', (t) => {
  const state = {
    params: {
      xxx: {
        input: {
          id: 'something',
          type: 'midi'
        }
      }
    }
  }

  const actual = getParamInputId(state, 'xxx')

  t.equal(actual, 'midi', 'Returns "midi" instead of actual id')
  t.end()
})

