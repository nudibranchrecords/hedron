import 'babel-polyfill'
import test from 'tape'
import { call, select, takeEvery } from 'redux-saga/effects'
import { watchProject, saveProject } from '../sagas'
import { getProjectData, getProjectFilepath } from '../selectors'
import { save } from '../../../utils/file'

test('(Saga) watchProject', (t) => {
  const generator = watchProject()
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_SAVE', saveProject)
  )
  t.end()
})

test('(Saga) saveProject', (t) => {
  const generator = saveProject()

  t.deepEqual(
    generator.next().value,
    select(getProjectData),
    '1. Gets project data'
  )

  const projectData = { foo: 'bar' }

  t.deepEqual(
    generator.next(projectData).value,
    select(getProjectFilepath),
    '2. Gets project filepath'
  )

  const filePath = 'some/path'

  t.deepEqual(
    generator.next(filePath).value,
    call(save, filePath, projectData),
    '3. Saves file'
  )

  t.end()
})
