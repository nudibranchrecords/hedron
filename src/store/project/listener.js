import { save, load } from '../../utils/file'
import uiEventEmitter from '../../utils/uiEventEmitter'
import { getProjectData, getProjectFilepath } from './selectors'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import { projectLoadSuccess, projectRehydrate, projectSaveAs,
  projectErrorAdd, projectErrorPopupOpen, projectErrorPopupClose,
  projectSave, projectLoadRequest, projectFilepathUpdate, projectSketchesPathUpdate,
} from './actions'
import { uSceneCreate } from '../scenes/actions'
import history from '../../history'
import { remote } from 'electron'
import { processDevices } from '../../inputs/MidiInput'

const fileFilters = [
  { name: 'JSON', extensions: ['json'] },
]

const saveAsProject = (action, store) => {
  remote.dialog.showSaveDialog({
    filters: fileFilters,
  }).then(({ filePath }) => {
    if (filePath) {
      store.dispatch(projectFilepathUpdate(filePath))
      store.dispatch(projectSave())
    }
  }).catch(err => {
    console.error(err)
  })
}

const saveProject = (action, store) => {
  try {
    const state = store.getState()
    const filepath = getProjectFilepath(state)
    if (filepath) {
      const data = getProjectData(state)
      save(filepath, data)
    } else {
      saveAsProject(action, store)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to save project: ${error.message}`)
  }
}

const loadProject = (action, store) => {
  remote.dialog.showOpenDialog({
    filters: fileFilters,
  }).then(result => {
    const filePath = result.filePaths[0]
    if (filePath) {
      store.dispatch(projectFilepathUpdate(filePath))
      store.dispatch(projectLoadRequest())
    }
  }).catch(error => {
    console.error(error)
    throw new Error(`Failed to load project: ${error.message}`)
  })
}

const loadProjectRequest = async (action, store) => {
  try {
    const state = store.getState()
    const filepath = getProjectFilepath(state)
    const projectData = await load(filepath)
    store.dispatch(projectRehydrate(projectData))
    processDevices()
    store.dispatch(projectFilepathUpdate(filepath))
    store.dispatch(projectLoadSuccess(projectData))
    history.replace(projectData.router.location.pathname)
    uiEventEmitter.emit('repaint')
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to load project: ${error.message}`)
  }
}

const chooseSketchesFolder = (action, store) => {
  const p = action.payload
  const state = store.getState()

  const sceneId = getCurrentSceneId(state)
  remote.dialog.showOpenDialog(
    {
      properties: ['openDirectory'],
    }
  ).then(result => {
    const filePath = result.filePaths[0]
    if (filePath) {
      store.dispatch(projectSketchesPathUpdate(filePath))
      store.dispatch(projectLoadSuccess())
      store.dispatch(projectErrorPopupClose())
      if (!p.disableRedirect) {
        history.push(`/scenes/addSketch/${sceneId}`)
      }
      if (p.createSceneAfter) {
        store.dispatch(uSceneCreate())
      }
    }
  }).catch(error => {
    console.error(error)
    throw new Error(`Failed to load sketches: ${error.message}`)
  })
}

const handleProjectError = (action, store) => {
  const p = action.payload
  store.dispatch(projectErrorAdd(p.message))

  if (p.meta && p.meta.popup) {
    store.dispatch(projectErrorPopupOpen(p.message, p.meta.code))
  }
}

export default (action, store) => {
  switch (action.type) {
    case 'PROJECT_SAVE':
      saveProject(action, store)
      break
    case 'PROJECT_LOAD':
      loadProject(action, store)
      break
    case 'PROJECT_LOAD_REQUEST':
      loadProjectRequest(action, store)
      break
    case 'PROJECT_SAVE_AS':
      saveAsProject(action, store)
      break
    case 'PROJECT_CHOOSE_SKETCHES_FOLDER':
      chooseSketchesFolder(action, store)
      break
    case 'PROJECT_ERROR':
      handleProjectError(action, store)
      break
  }
}
