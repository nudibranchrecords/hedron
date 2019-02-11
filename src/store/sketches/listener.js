import uid from 'uid'
import path from 'path'

import { sketchCreate, sketchDelete, sketchUpdate } from './actions'
import { rSceneSketchAdd, rSceneSketchRemove, sceneSketchSelect } from '../scenes/actions'
import { uNodeCreate, uNodeDelete, nodeUpdate } from '../nodes/actions'
import { engineSceneSketchAdd, engineSceneSketchDelete } from '../../engine/actions'
import getScene from '../../selectors/getScene'
import getSketch from '../../selectors/getSketch'
import getNode from '../../selectors/getNode'
import getModule from '../../selectors/getModule'
import getSketchParamIds from '../../selectors/getSketchParamIds'
import getSketchShotIds from '../../selectors/getSketchShotIds'
import getCurrentSceneId from '../../selectors/getCurrentSceneId'
import history from '../../history'
import getSketchesPath from '../../selectors/getSketchesPath'
import getModuleSketchIds from '../../selectors/getModuleSketchIds'
import { reloadSingleSketchModule, removeSketchFromScene,
  addSketchToScene, reloadSingleSketchConfig } from '../../engine'

const handleSketchCreate = (action, store) => {
  let uniqueId
  const state = store.getState()
  let { moduleId, sceneId } = action.payload

  if (!sceneId) {
    sceneId = getCurrentSceneId(state)
  }
  const uniqueSketchId = uid()
  const module = getModule(state, moduleId)
  const paramIds = []
  const inputLinkIds = []
  const shotIds = []

  store.dispatch(rSceneSketchAdd(sceneId, uniqueSketchId))

  if (module.params) {
    for (let i = 0; i < module.params.length; i++) {
      const param = module.params[i]

      uniqueId = uid()
      paramIds.push(uniqueId)
      store.dispatch(uNodeCreate(uniqueId, {
        title: param.title ? param.title : param.key,
        type: 'param',
        key: param.key,
        value: param.defaultValue,
        hidden: param.hidden === undefined ? false : param.hidden,
        min: param.defaultMin ? param.defaultMin : 0,
        max: param.defaultMax ? param.defaultMax : 1,
        defaultMin: param.defaultMin ? param.defaultMin : 0,
        defaultMax: param.defaultMax ? param.defaultMax : 1,
        id: uniqueId,
        inputLinkIds,
      }))
    }
  }

  if (module.shots) {
    for (let i = 0; i < module.shots.length; i++) {
      const shot = module.shots[i]
      uniqueId = uid()
      shotIds.push(uniqueId)
      store.dispatch(uNodeCreate(uniqueId, {
        id: uniqueId,
        value: 0,
        type: 'shot',
        title: shot.title,
        method: shot.method,
        sketchId: uniqueSketchId,
        inputLinkIds,
      }))
    }
  }

  store.dispatch(sketchCreate(uniqueSketchId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds,
    shotIds,
  }))

  store.dispatch(sceneSketchSelect(sceneId, uniqueSketchId))
  store.dispatch(engineSceneSketchAdd(sceneId, uniqueSketchId, moduleId))

  history.push('/scenes/view/' + sceneId)
}

const handleSketchDelete = (action, store) => {
  let state = store.getState()
  let { id, sceneId } = action.payload
  if (!sceneId) {
    sceneId = getCurrentSceneId(state)
  }
  const paramIds = getSketchParamIds(state, id)

  store.dispatch(rSceneSketchRemove(sceneId, id))

  for (let i = 0; i < paramIds.length; i++) {
    store.dispatch(uNodeDelete(paramIds[i]))
  }

  const shotIds = getSketchShotIds(state, id)

  for (let i = 0; i < shotIds.length; i++) {
    store.dispatch(uNodeDelete(shotIds[i]))
  }

  store.dispatch(sketchDelete(id))

  state = store.getState()
  const currentScene = getScene(state, sceneId)
  const sketchIds = currentScene.sketchIds
  const newSceneSketchId = sketchIds[sketchIds.length - 1] || false
  store.dispatch(sceneSketchSelect(sceneId, newSceneSketchId))
  store.dispatch(engineSceneSketchDelete(sceneId, id))
  history.push('/scenes/view/' + sceneId)
}

const sketchReimport = (sketchId, store) => {
  const state = store.getState()
  const sketch = getSketch(state, sketchId)
  const sketchModule = getModule(state, sketch.moduleId)
  let paramIds = sketch.paramIds
  let shotIds = sketch.shotIds
  const sketchParams = {}
  const sketchShots = {}

  const moduleParams = sketchModule.params
  const moduleShots = sketchModule.shots

  // loop through current params (backwards because we might delete some!)
  for (let i = paramIds.length - 1; i > -1; i--) {
    const param = getNode(state, paramIds[i])
    const found = moduleParams.find(moduleParam => moduleParam.key === param.key)

    if (found) {
      sketchParams[param.key] = param
    } else {
      // if param doesnt match with new params, remove the node
      paramIds = paramIds.filter(id => param.id !== id)
      store.dispatch(uNodeDelete(param.id))
    }
  }

  for (let i = 0; i < shotIds.length; i++) {
    const shot = getNode(state, shotIds[i])
    sketchShots[shot.method] = shot
  }

  // Look through the loaded module's params for new ones
  for (let i = 0; i < moduleParams.length; i++) {
    const moduleParam = moduleParams[i]
    const sketchParam = sketchParams[moduleParam.key]

    if (!sketchParam) {
      // If module param doesnt exist in sketch, it needs to be created
      const uniqueId = uid()
      paramIds = [
        ...paramIds.slice(0, i), uniqueId, ...paramIds.slice(i),
      ]
      store.dispatch(uNodeCreate(uniqueId, {
        title: moduleParam.title ? moduleParam.title : moduleParam.key,
        type: 'param',
        key: moduleParam.key,
        value: moduleParam.defaultValue,
        hidden: moduleParam.hidden === undefined ? false : moduleParam.hidden,
        min: moduleParam.defaultMin ? moduleParam.defaultMin : 0,
        max: moduleParam.defaultMax ? moduleParam.defaultMax : 1,
        defaultMin: moduleParam.defaultMin ? moduleParam.defaultMin : 0,
        defaultMax: moduleParam.defaultMax ? moduleParam.defaultMax : 1,
        id: uniqueId,
        inputLinkIds: [],
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchParam.id
      store.dispatch(nodeUpdate(id, {
        title: moduleParam.title ? moduleParam.title : moduleParam.key,
        defaultMin: moduleParam.defaultMin ? moduleParam.defaultMin : 0,
        defaultMax: moduleParam.defaultMax ? moduleParam.defaultMax : 1,
      }))
    }
  }

  // Look through the loaded module's shots for new ones
  for (let i = 0; i < moduleShots.length; i++) {
    const moduleShot = moduleShots[i]
    const sketchShot = sketchShots[moduleShot.method]

    if (!sketchShot) {
      // If module shot doesnt exist in sketch, it needs to be created
      const uniqueId = uid()
      shotIds = [
        ...shotIds.slice(0, i), uniqueId, ...shotIds.slice(i),
      ]
      store.dispatch(uNodeCreate(uniqueId, {
        id: uniqueId,
        value: 0,
        type: 'shot',
        title: moduleShot.title,
        method: moduleShot.method,
        sketchId: sketchId,
        inputLinkIds: [],
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchShot.id
      store.dispatch(nodeUpdate(id, { title: sketchShot.title }))
    }
  }

  store.dispatch(sketchUpdate(sketchId, { paramIds, shotIds }))
}

// Reload the index file for a sketch module but not the config
const moduleReloadFile = (moduleId, state) => {
  const sketchesPath = getSketchesPath(state)
  const moduleFilePathArray = getModule(state, moduleId).filePathArray
  const moduleSketchIds = getModuleSketchIds(state, moduleId)

  const modulePath = path.join(sketchesPath, moduleFilePathArray.join('/'), moduleId)

  // Reload updated module into app
  reloadSingleSketchModule(modulePath, moduleId, moduleFilePathArray)

  // Loop all sketches that are of this module, remove them from webGL scene and add them again
  moduleSketchIds.forEach(obj => {
    // These funcs only affect the scene, not the application state, so won't destroy params etc
    removeSketchFromScene(obj.sceneId, obj.sketchId)
    addSketchToScene(obj.sceneId, obj.sketchId, moduleId)
  })
}

const handleModuleReloadFile = (action, store) => {
  const state = store.getState()
  moduleReloadFile(action.payload.moduleId, state)
}

const handleSketchReloadFile = (action, store) => {
  const state = store.getState()
  const moduleId = getSketch(state, action.payload.id).moduleId

  moduleReloadFile(moduleId, state)
}

// Reload config file and update params for all sketches using that module
const handleConfigReloadFile = (action, store) => {
  const state = store.getState()
  const moduleId = action.payload.moduleId
  const sketchesPath = getSketchesPath(state)
  const moduleSketchIds = getModuleSketchIds(state, moduleId)
  const moduleFilePathArray = getModule(state, moduleId).filePathArray
  const modulePath = path.join(sketchesPath, moduleFilePathArray.join('/'), moduleId)

  moduleSketchIds.forEach(obj => {
    reloadSingleSketchConfig(modulePath, moduleId, moduleFilePathArray)
    sketchReimport(obj.sketchId, store)
  })

  moduleReloadFile(moduleId, state)
}

// Reload config file and update params for just one sketch using that module
const handleSketchReimport = (action, store) => {
  const state = store.getState()
  const sketchId = action.payload.id
  const sketch = getSketch(state, sketchId)
  const moduleId = sketch.moduleId

  const sketchesPath = getSketchesPath(state)
  const moduleFilePathArray = getModule(state, moduleId).filePathArray
  const modulePath = path.join(sketchesPath, moduleFilePathArray.join('/'), moduleId)

  reloadSingleSketchConfig(modulePath, moduleId, moduleFilePathArray)
  sketchReimport(sketchId, store)
  moduleReloadFile(moduleId, state)
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SKETCH_CREATE':
      handleSketchCreate(action, store)
      break
    case 'U_SKETCH_DELETE':
      handleSketchDelete(action, store)
      break
    case 'U_SKETCH_REIMPORT':
      handleSketchReimport(action, store)
      break
    case 'U_SKETCH_RELOAD_FILE':
      handleSketchReloadFile(action, store)
      break
    case 'FILE_SKETCH_MODULE_CHANGED':
      handleModuleReloadFile(action, store)
      break
    case 'FILE_SKETCH_CONFIG_CHANGED':
      handleConfigReloadFile(action, store)
      break
  }
}
