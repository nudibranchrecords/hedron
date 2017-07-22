import 'babel-polyfill'
import test from 'tape'
import { call, select, takeEvery, put } from 'redux-saga/effects'
import { watchProject, saveProject, loadProject } from '../sagas'
import { getProjectData, getProjectFilepath } from '../selectors'
import { save, load } from '../../../utils/file'
import { projectLoadSuccess } from '../actions'
import { sketchesReplaceAll } from '../../sketches/actions'
import { nodesReplaceAll } from '../../nodes/actions'
import { inputsReplaceAll } from '../../inputs/actions'
import { inputLinksReplaceAll } from '../../inputLinks/actions'

test('(Saga) watchProject', (t) => {
  const generator = watchProject()
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_SAVE', saveProject)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_LOAD_REQUEST', loadProject)
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

test('(Saga) loadProject', (t) => {
  const generator = loadProject()

  t.deepEqual(
    generator.next(projectData).value,
    select(getProjectFilepath),
    '1. Gets project filepath'
  )

  const filePath = 'some/path'

  t.deepEqual(
    generator.next(filePath).value,
    call(load, filePath),
    '2. Loads file'
  )

  const projectData = {
    project: '@@project',
    inputs: '@@inputs',
    sketches: '@@sketches',
    nodes: '@@nodes',
    shots: '@@shots',
    inputLinks: '@@inputLinks'
  }

  t.deepEqual(
    generator.next(projectData).value,
    put(sketchesReplaceAll(projectData.sketches)),
    '3. Dispatches sketchesReplaceAll'
  )

  t.deepEqual(
    generator.next().value,
    put(nodesReplaceAll(projectData.nodes)),
    '4. Dispatches nodesReplaceAll'
  )

  t.deepEqual(
    generator.next().value,
    put(inputsReplaceAll(projectData.inputs)),
    '5. Dispatches inputsReplaceAll'
  )

  t.deepEqual(
    generator.next().value,
    put(inputLinksReplaceAll(projectData.inputLinks)),
    '5. Dispatches inputLinksReplaceAll'
  )

  t.deepEqual(
    generator.next().value,
    put(projectLoadSuccess(projectData)),
    '6. Fires PROJECT_LOAD_SUCCESS with data'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
