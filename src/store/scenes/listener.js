import uid from 'uid'
import { rSceneCreate, rSceneDelete, sceneSketchDelete } from './actions'
import getScene from '../../selectors/getScene'

const handleSceneCreate = (action, store) => {
  const id = uid()
  const scene = {
    id,
    sketchIds: []
  }
  store.dispatch(rSceneCreate(id, scene))
}

const handleSceneDelete = (action, store) => {
  const p = action.payload
  const state = store.getState()
  const scene = getScene(state, p.id)

  scene.sketchIds.forEach(sketchId => {
    console.log(sketchId)
    store.dispatch(sceneSketchDelete(sketchId))
  })
  store.dispatch(rSceneDelete(p.id))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SCENE_CREATE':
      handleSceneCreate(action, store)
      break
    case 'U_SCENE_DELETE':
      handleSceneDelete(action, store)
      break
  }
}
