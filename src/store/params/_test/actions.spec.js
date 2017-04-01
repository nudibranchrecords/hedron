import test from 'tape'
import * as a from '../actions'

test('(Action Creator) paramValueUpdate', (t) => {
  let actual = a.paramValueUpdate('01', 0.5)
  let expected = {
    type: 'PARAM_VALUE_UPDATE',
    payload: {
      id: '01',
      value: 0.5
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update param')
  t.end()
})
