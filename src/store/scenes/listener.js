import uid from 'uid'
import { rSceneCreate, rSceneDelete } from './actions'
import { uSketchDelete } from '../sketches/actions'
import getScene from '../../selectors/getScene'

const handleSceneCreate = (action, store) => {
  const id = uid()
  const scene = {
    id,
    title: 'New Scene',
    selectedSketchId: false,
    sketchIds: []
  }
  store.dispatch(rSceneCreate(id, scene))
}

const handleSceneDelete = (action, store) => {
  const p = action.payload
  const state = store.getState()
  const scene = getScene(state, p.id)

  scene.sketchIds.forEach(sketchId => {
    store.dispatch(uSketchDelete(sketchId, p.id))
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
