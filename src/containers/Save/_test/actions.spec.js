import test from 'tape'
import * as a from '../actions'

test('(Action Creator) saveProject', (t) => {
  let actual = a.saveProject('PATH')
  let expected = {
    type: 'PROJECT_SAVE',
    payload: {
      filePath: 'PATH'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to save current project')
  t.end()
})
