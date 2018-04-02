import getSketchesPath from '../selectors/getSketchesPath'
import { projectError } from '../store/project/actions'

import * as engine from './'

export const handleAddScene = (action) => {
  const { sceneId } = action.payload
  engine.addScene(sceneId)
}

export const handleRemoveScene = (action) => {
  const { sceneId } = action.payload
  engine.removeScene(sceneId)
}

export const handleAddSketch = (action) => {
  const { sceneId, sketchId, moduleId } = action.payload
  engine.addSketchToScene(sceneId, sketchId, moduleId)
}

export const handleDeleteSketch = (action) => {
  const { sceneId, sketchId } = action.payload
  engine.removeSketchFromScene(sceneId, sketchId)
}

export const handleInitiateScenes = (action, store) => {
  try {
    const state = store.getState()
    const sketchesPath = getSketchesPath(state)
    engine.loadSketchModules(sketchesPath)
    engine.initiateScenes()
  } catch (error) {
    console.error(error)
    store.dispatch(projectError(`Failed to initiate sketches: ${error.message}`))
  }
}

export const handleShotFired = (action) => {
  engine.fireShot(action.payload.sketchId, action.payload.method)
}

export default (action, store) => {
  switch (action.type) {
    case 'ENGINE_SCENE_SKETCH_ADD':
      handleAddSketch(action, store)
      break
    case 'ENGINE_SCENE_SKETCH_DELETE':
      handleDeleteSketch(action, store)
      break
    case 'ENGINE_SCENE_ADD':
      handleAddScene(action, store)
      break
    case 'ENGINE_SCENE_REMOVE':
      handleRemoveScene(action, store)
      break
    case 'PROJECT_LOAD_SUCCESS':
      handleInitiateScenes(action, store)
      break
    case 'NODE_SHOT_FIRED':
      handleShotFired(action, store)
      break
  }
}
