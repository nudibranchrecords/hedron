import { save, load } from '../../utils/file'
import uiEventEmitter from '../../utils/uiEventEmitter'
import { getProjectData, getProjectFilepath } from './selectors'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import { projectLoadSuccess, projectRehydrate,
  projectErrorAdd, projectErrorPopupOpen, projectErrorPopupClose,
  projectSave, projectLoadRequest, projectFilepathUpdate, projectSketchesPathUpdate,
} from './actions'
import { uSceneCreate } from '../scenes/actions'
import history from '../../history'
import { remote } from 'electron'
import { processDevices } from '../../inputs/MidiInput'
import { loadSketchModules, initiateScenes } from '../../engine'
import getSketchesPath from '../../selectors/getSketchesPath'
import getConnectedDevices from '../../selectors/getConnectedDevices'
import { initialize } from 'redux-form'

const fileFilters = [
  { name: 'JSON', extensions: ['json'] },
]

const saveAsProject = async (action, store) => {
  const { filePath } = await remote.dialog.showSaveDialog({ filters: fileFilters })

  if (filePath) {
    store.dispatch(projectFilepathUpdate(filePath))
    store.dispatch(projectSave())
  }
}

const saveProject = async (action, store) => {
  try {
    const state = store.getState()
    const filePath = getProjectFilepath(state)
    if (filePath) {
      const data = getProjectData(state)
      save(filePath, data)
    } else {
      await saveAsProject(action, store)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to save project: ${error.message}`)
  }
}

const loadProject = async (action, store) => {
  try {
    const result = await remote.dialog.showOpenDialog({ filters: fileFilters })
    const filePath = result.filePaths[0]
    if (filePath) {
      store.dispatch(projectFilepathUpdate(filePath))
      store.dispatch(projectLoadRequest())
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to load project: ${error.message}`)
  }
}

const loadProjectRequest = async (action, store) => {
  try {
    let state = store.getState()
    const filePath = getProjectFilepath(state)
    const projectData = await load(filePath)

    const sketchesPath = getSketchesPath(projectData)

    store.dispatch(projectRehydrate(projectData))
    store.dispatch(projectFilepathUpdate(filePath))

    loadSketchModules(sketchesPath, { siblingCheck: true })
    initiateScenes()

    store.dispatch(projectLoadSuccess())
    history.replace(projectData.router.location.pathname)

    await processDevices()
    state = store.getState()
    const devices = getConnectedDevices(state)
    // We have to initialize forms for each midi device, because redux-form
    // doesn't seem to want to initialize automatically
    // TODO: Prevent the need to do this (probably replace redux-form)
    devices.forEach(device => {
      store.dispatch(initialize(`device_${device.id}`, device.settings))
    })

    uiEventEmitter.emit('repaint')
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to load project: ${error.message}`)
  }
}

const chooseSketchesFolder = async (action, store) => {
  const p = action.payload
  const state = store.getState()

  const sceneId = getCurrentSceneId(state)
  const result = await remote.dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  const filePath = result.filePaths[0]
  if (filePath) {
    loadSketchModules(filePath, { siblingCheck: false })
    initiateScenes()
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
}

const handleProjectError = (action, store) => {
  const p = action.payload
  store.dispatch(projectErrorAdd(p.message))

  if (p.meta && p.meta.popup) {
    store.dispatch(projectErrorPopupOpen(p.message, p.meta.code))
  }
}

export default async (action, store) => {
  switch (action.type) {
    case 'PROJECT_SAVE':
      await saveProject(action, store)
      break
    case 'PROJECT_LOAD':
      await loadProject(action, store)
      break
    case 'PROJECT_LOAD_REQUEST':
      await loadProjectRequest(action, store)
      break
    case 'PROJECT_SAVE_AS':
      saveAsProject(action, store)
      break
    case 'PROJECT_CHOOSE_SKETCHES_FOLDER':
      await chooseSketchesFolder(action, store)
      break
    case 'PROJECT_ERROR':
      handleProjectError(action, store)
      break
  }
}
