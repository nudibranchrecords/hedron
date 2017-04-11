import test from 'tape'
import { projectSave, projectFilepathUpdate, projectLoadRequest, projectLoadSuccess } from '../actions'

test('(Action Creator) projectSave', (t) => {
  let actual = projectSave()
  let expected = {
    type: 'PROJECT_SAVE'
  }
  t.deepEqual(actual, expected, 'Creates action to save current project')
  t.end()
})

test('(Action Creator) projectLoad', (t) => {
  let actual = projectLoadRequest()
  let expected = {
    type: 'PROJECT_LOAD_REQUEST'
  }
  t.deepEqual(actual, expected, 'Creates action to load a project')
  t.end()
})

test('(Action Creator) projectLoad', (t) => {
  const data = { foo: 'bar' }
  let actual = projectLoadSuccess(data)
  let expected = {
    type: 'PROJECT_LOAD_SUCCESS',
    payload: {
      data
    }
  }
  t.deepEqual(actual, expected, 'Creates action to load a project')
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
