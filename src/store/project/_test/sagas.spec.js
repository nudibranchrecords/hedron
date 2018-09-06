import 'babel-polyfill'
import test from 'tape'
import { call, select, takeEvery, put } from 'redux-saga/effects'
import { watchProject, saveProject, loadProjectRequest,
  saveAsProject, loadProject, chooseSketchesFolder, handleProjectError } from '../sagas'
import { getProjectData, getProjectFilepath } from '../selectors'
import { save, load } from '../../../utils/file'
import { projectLoadSuccess, projectRehydrate, projectError, projectSaveAs,
  projectErrorAdd, projectErrorPopupOpen, projectFilepathUpdate
} from '../actions'
import history from '../../../history'

test('(Saga) watchProject', (t) => {
  const dispatch = () => 'foo'

  const generator = watchProject(dispatch)
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_SAVE', saveProject)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_LOAD', loadProject, dispatch),
    'pass dispatch to loadProjet'
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_LOAD_REQUEST', loadProjectRequest)
  )
  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_SAVE_AS', saveAsProject, dispatch),
    'pass dispatch to save as'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_CHOOSE_SKETCHES_FOLDER', chooseSketchesFolder, dispatch),
    'pass dispatch to choose chooseSketchesFolder'
  )

  t.deepEqual(
    generator.next().value,
    takeEvery('PROJECT_ERROR', handleProjectError)
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) saveProject (filepath exists)', (t) => {
  const generator = saveProject()

  t.deepEqual(
    generator.next().value,
    select(getProjectFilepath),
    '1. Gets project filepath'
  )

  const filePath = 'some/path'

  t.deepEqual(
    generator.next(filePath).value,
    select(getProjectData),
    '2. Gets project data'
  )

  const projectData = { foo: 'bar' }

  t.deepEqual(
    generator.next(projectData).value,
    call(save, filePath, projectData),
    '3. Saves file'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) saveProject (filepath doesnt exist)', (t) => {
  const generator = saveProject()

  t.deepEqual(
    generator.next().value,
    select(getProjectFilepath),
    '1. Gets project filepath'
  )

  const filePath = undefined

  t.deepEqual(
    generator.next(filePath).value,
    put(projectSaveAs()),
    '2. Dispatch projectSaveAs because there is no filepath to use'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) loadProject', (t) => {
  const generator = loadProjectRequest()

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
    project: {
      sketchesPath: 'sketches_path'
    },
    inputs: '@@inputs',
    sketches: '@@sketches',
    nodes: '@@nodes',
    shots: '@@shots',
    inputLinks: '@@inputLinks',
    router: {
      location: {
        pathname: '/foo/bar'
      }
    }
  }

  t.deepEqual(
    generator.next(projectData).value,
    put(projectRehydrate(projectData)),
    '3. Fires PROJECT_REHYDRATE with data'
  )

  t.deepEqual(
    generator.next().value,
    put(projectFilepathUpdate(filePath)),
    '4. Fires projectFilepathUpdate() with new filepath'
  )

  t.deepEqual(
    generator.next().value,
    put(projectLoadSuccess(projectData)),
    '5. Fires PROJECT_LOAD_SUCCESS with data'
  )

  t.deepEqual(
    generator.next().value,
    call([history, history.replace], '/foo/bar'),
    '6. Matches history with router state'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleProjectError (normal error)', (t) => {
  const errorMessage = 'foo error!'
  const generator = handleProjectError(
    projectError(errorMessage)
  )

  t.deepEqual(
    generator.next().value,
    put(projectErrorAdd(errorMessage)),
    '1. Dispatch projectErrorAdd'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})

test('(Saga) handleProjectError (popup error)', (t) => {
  const errorMessage = 'foo error!'
  const meta = {
    popup: true,
    code: 'FOO'
  }
  const generator = handleProjectError(
    projectError(errorMessage, meta)
  )

  t.deepEqual(
    generator.next().value,
    put(projectErrorAdd(errorMessage)),
    '1. Dispatch projectErrorAdd'
  )

  t.deepEqual(
    generator.next().value,
    put(projectErrorPopupOpen(errorMessage, meta.code)),
    '2. Dispatch projectErrorPopup'
  )

  t.equal(generator.next().done, true, 'Generator ends')
  t.end()
})
