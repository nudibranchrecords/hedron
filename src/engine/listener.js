import getSketchesPath from '../selectors/getSketchesPath'
import { projectError } from '../store/project/actions'

import engine from './'

export const handleAddSketch = (action) => {
  const id = action.payload.id
  const moduleId = action.payload.sketch.moduleId
  engine.addSketch(id, moduleId)
}

export const handleRemoveSketch = (action) => {
  engine.removeSketch(action.payload.id)
}

export const handleInitiateScenes = (action, store) => {
  try {
    const state = store.getState()
    const sketchesPath = getSketchesPath(state)
    engine.loadSketchModules(sketchesPath)
    engine.initiateScenes()
  } catch (error) {
    console.log(error)
    store.dispatch(projectError(`Failed to initiate sketches: ${error.message}`))
  }
}

export const handleShotFired = (action) => {
  engine.fireShot(action.payload.sketchId, action.payload.method)
}

export default (action, store) => {
  switch (action.type) {
    case 'SKETCH_CREATE':
      handleAddSketch(action, store)
      break
    case 'SKETCH_DELETE':
      handleRemoveSketch(action, store)
      break
    case 'PROJECT_LOAD_SUCCESS':
      handleInitiateScenes(action, store)
      break
    case 'NODE_SHOT_FIRED':
      handleShotFired(action, store)
      break
  }
}
