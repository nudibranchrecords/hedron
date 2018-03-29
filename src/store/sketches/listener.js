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
import uid from 'uid'

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
        title: param.title,
        type: 'param',
        key: param.key,
        value: param.defaultValue,
        id: uniqueId,
        inputLinkIds
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
        inputLinkIds
      }))
    }
  }

  store.dispatch(sketchCreate(uniqueSketchId, {
    title: module.defaultTitle,
    moduleId: moduleId,
    paramIds,
    shotIds,
    openedNodes: {}
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

const handleSketchReimport = (action, store) => {
  const state = store.getState()
  const id = action.payload.id
  const sketch = getSketch(state, id)
  const module = getModule(state, sketch.moduleId)
  let paramIds = sketch.paramIds
  let shotIds = sketch.shotIds
  const sketchParams = {}
  const sketchShots = {}

  for (let i = 0; i < paramIds.length; i++) {
    const param = getNode(state, paramIds[i])
    sketchParams[param.key] = param
  }

  for (let i = 0; i < shotIds.length; i++) {
    const shot = getNode(state, shotIds[i])
    sketchShots[shot.method] = shot
  }

  const moduleParams = module.params
  const moduleShots = module.shots

  // Look through the loaded module's params for new ones
  for (let i = 0; i < moduleParams.length; i++) {
    const moduleParam = moduleParams[i]
    const sketchParam = sketchParams[moduleParam.key]

    if (!sketchParam) {
      // If module param doesnt exist in sketch, it needs to be created
      const uniqueId = uid()
      paramIds = [
        ...paramIds.slice(0, i), uniqueId, ...paramIds.slice(i)
      ]
      store.dispatch(uNodeCreate(uniqueId, {
        title: moduleParam.title,
        type: 'param',
        key: moduleParam.key,
        value: moduleParam.defaultValue,
        id: uniqueId,
        inputLinkIds: []
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchParam.id
      store.dispatch(nodeUpdate(id, { title: moduleParam.title }))
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
        ...shotIds.slice(0, i), uniqueId, ...shotIds.slice(i)
      ]
      store.dispatch(uNodeCreate(uniqueId, {
        id: uniqueId,
        value: 0,
        type: 'shot',
        title: moduleShot.title,
        method: moduleShot.method,
        sketchId: id,
        inputLinkIds: []
      }))
    } else {
      // If param does exist, the title may still change
      const id = sketchShot.id
      store.dispatch(nodeUpdate(id, { title: sketchShot.title }))
    }
  }

  store.dispatch(sketchUpdate(id, { paramIds, shotIds }))
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
  }
}
