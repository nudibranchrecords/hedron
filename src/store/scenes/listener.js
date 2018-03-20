import uid from 'uid'
import { rSceneCreate, rSceneDelete } from './actions'
import { uSketchDelete } from '../sketches/actions'
import getScene from '../../selectors/getScene'
import getScenes from '../../selectors/getScenes'
import history from '../../history'

const handleSceneCreate = (action, store) => {
  const id = uid()
  const scene = {
    id,
    title: 'New Scene',
    selectedSketchId: false,
    sketchIds: []
  }
  store.dispatch(rSceneCreate(id, scene))
  history.push(`/scenes/view/${id}`)
}

const handleSceneDelete = (action, store) => {
  const p = action.payload
  let state = store.getState()
  const scene = getScene(state, p.id)

  scene.sketchIds.forEach(sketchId => {
    store.dispatch(uSketchDelete(sketchId, p.id))
  })
  store.dispatch(rSceneDelete(p.id))
  state = store.getState()
  const scenes = getScenes(state)
  const lastScene = scenes[scenes.length - 1]
  let url = lastScene ? `/scenes/view/${lastScene.id}` : '/'

  history.push(url)
}

const handleSceneSketchSelect = (action, store) => {
  const p = action.payload
  history.push(`/scenes/view/${p.id}`)
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SCENE_CREATE':
      handleSceneCreate(action, store)
      break
    case 'U_SCENE_DELETE':
      handleSceneDelete(action, store)
      break
    case 'SCENE_SKETCH_SELECT':
      handleSceneSketchSelect(action, store)
      break
  }
}
