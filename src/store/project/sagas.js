import { call, select, takeEvery, put } from 'redux-saga/effects'
import { save, load } from '../../utils/file'
import { getProjectData, getProjectFilepath } from './selectors'
import { projectLoadSuccess, projectRehydrate, projectError, projectSaveAs } from './actions'
import history from '../../history'
import engine from '../../Engine'
import { remote } from 'electron'
import {
  projectSave, projectLoadRequest, projectFilepathUpdate, projectSketchesPathUpdate
} from '../../store/project/actions'

const fileFilters = [
  { name: 'JSON', extensions: ['json'] }
]
export function* saveAsProject (dispatch) {
  remote.dialog.showSaveDialog({
    filters: fileFilters
  },
  filePath => {
    if (filePath) {
      dispatch(projectFilepathUpdate(filePath))
      dispatch(projectSave())
    }
  })
}

export function* saveProject () {
  try {
    const filepath = yield select(getProjectFilepath)
    if (filepath) {
      const data = yield select(getProjectData)
      yield call(save, filepath, data)
    } else {
      yield put(projectSaveAs())
    }
  } catch (error) {
    console.error(error)
    yield put(projectError(`Failed to save file: ${error.message}`))
  }
}

export function* loadProject (dispatch) {
  remote.dialog.showOpenDialog({
    filters: fileFilters
  },
  filePath => {
    if (filePath) {
      dispatch(projectFilepathUpdate(filePath[0]))
      dispatch(projectLoadRequest())
    }
  })
}

export function* loadProjectRequest () {
  try {
    const filepath = yield select(getProjectFilepath)
    const projectData = yield call(load, filepath)
    yield put(projectRehydrate(projectData))
    yield put(projectLoadSuccess(projectData))
    yield call([history, history.replace], projectData.router.location.pathname)
  } catch (error) {
    console.error(error)
    yield put(projectError(`Failed to load file: ${error.message}`))
  }
}

export function* chooseSketchesFolder (dispatch) {
  remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  },
  filePath => {
    if (filePath) {
      dispatch(projectSketchesPathUpdate(filePath[0]))
      engine.loadSketchModules(filePath[0])
      history.push('/sketches/add')
    }
  })
}

export function* watchProject (dispatch) {
  yield takeEvery('PROJECT_SAVE', saveProject)
  yield takeEvery('PROJECT_LOAD', loadProject, dispatch)
  yield takeEvery('PROJECT_LOAD_REQUEST', loadProjectRequest)
  yield takeEvery('PROJECT_SAVE_AS', saveAsProject, dispatch)
  yield takeEvery('PROJECT_CHOOSE_SKETCHES_FOLDER', chooseSketchesFolder, dispatch)
}
