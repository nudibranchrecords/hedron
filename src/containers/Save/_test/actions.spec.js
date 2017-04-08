import test from 'tape'
import * as a from '../actions'

test('(Action Creator) saveProject', (t) => {
  let actual = a.saveProject()
  let expected = {
    type: 'SAVE_PROJECT'
  }
  t.deepEqual(actual, expected, 'Creates action to save current project')
  t.end()
})
