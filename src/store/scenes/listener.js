import uid from 'uid'
import { rSceneCreate, rSceneDelete, rSceneSelectCurrent } from './actions'
import { engineSceneAdd, engineSceneRemove } from '../../engine/actions'
import { uSketchDelete } from '../sketches/actions'
import { uiEditingOpen } from '../ui/actions'
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
  store.dispatch(engineSceneAdd(id))

  store.dispatch(rSceneSelectCurrent(id))
  history.push(`/scenes/view`)

  store.dispatch(uiEditingOpen('sceneTitle', id))
}

const handleSceneDelete = (action, store) => {
  const p = action.payload
  let state = store.getState()
  const scene = getScene(state, p.id)

  scene.sketchIds.forEach(sketchId => {
    store.dispatch(uSketchDelete(sketchId, p.id))
  })
  store.dispatch(rSceneDelete(p.id))
  store.dispatch(engineSceneRemove(p.id))
  state = store.getState()
  const scenes = getScenes(state)
  const lastScene = scenes[scenes.length - 1]
  let url = lastScene ? `/scenes/view` : '/'

  store.dispatch(rSceneSelectCurrent(lastScene && lastScene.id))
  history.push(url)
}

const handleSceneSketchSelect = (action, store) => {
  history.push(`/scenes/view`)
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
