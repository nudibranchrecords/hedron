import test from 'tape'
import { projectSave, projectFilepathUpdate } from '../actions'

test('(Action Creator) saveProject', (t) => {
  let actual = projectSave()
  let expected = {
    type: 'PROJECT_SAVE'
  }
  t.deepEqual(actual, expected, 'Creates action to save current project')
  t.end()
})

test('(Action Creator) projectFilepathUpdate', (t) => {
  let actual = projectFilepathUpdate('PATH')
  let expected = {
    type: 'PROJECT_FILEPATH_UPDATE',
    payload: {
      filePath: 'PATH'
    }
  }
  t.deepEqual(actual, expected, 'Creates action to update file of project')
  t.end()
})
