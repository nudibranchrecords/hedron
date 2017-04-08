import 'babel-polyfill'
import test from 'tape'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { saveSaga, saveProject } from '../'
import { getProject } from '../selectors'
import { save } from '../../../utils/file'

test('(Saga) saveSaga', (t) => {
  const generator = saveSaga()
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_SAVE', saveProject)
  )
  t.end()
})

test('(Saga) saveProject', (t) => {
  const filePath = 'some/path'

  const generator = saveProject({
    payload: {
      filePath
    }
  })

  t.deepEqual(
    generator.next().value,
    select(getProject),
    'Gets project data'
  )

  const projectData = { foo: 'bar' }

  t.deepEqual(
    generator.next(projectData).value,
    call(save, filePath, projectData),
    'Saves file'
  )

  t.end()
})
