import uid from 'uid'
import { rSceneCreate, rSceneDelete, rSceneSelectCurrent,
  rSceneSelectChannel, uSceneSelectChannel } from './actions'
import { engineSceneAdd, engineSceneRemove } from '../../engine/actions'
import { linkableActionCreate } from '../linkableActions/actions'
import { uSketchDelete } from '../sketches/actions'
import { uiEditingOpen } from '../ui/actions'
import getScene from '../../selectors/getScene'
import getScenes from '../../selectors/getScenes'
import getSceneCrossfaderValue from '../../selectors/getSceneCrossfaderValue'
import history from '../../history'

const handleSceneCreate = (action, store) => {
  const id = uid()

  const la = {
    addToA: {
      action: rSceneSelectChannel(id, 'A'),
      id: uid()
    },
    addToB: {
      action: rSceneSelectChannel(id, 'B'),
      id: uid()
    },
    addToActive: {
      action: uSceneSelectChannel(id, 'active'),
      id: uid()
    },
    addToOpposite: {
      action: uSceneSelectChannel(id, 'opposite'),
      id: uid()
    },
    clear: {
      action: rSceneSelectChannel(id, false),
      id: uid()
    }
  }

  for (const key in la) {
    store.dispatch(linkableActionCreate(la[key].id, la[key].action))
  }

  const scene = {
    id,
    title: 'New Scene',
    selectedSketchId: false,
    sketchIds: [],
    linkableActionIds: {
      addToA: la.addToA.id,
      addToB: la.addToB.id,
      addToActive: la.addToActive.id,
      addToOpposite: la.addToOpposite.id,
      clear: la.clear.id
    }
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

  store.dispatch(rSceneSelectCurrent(lastScene ? lastScene.id : false))
  history.push(url)
}

const handleSceneSketchSelect = (action, store) => {
  history.push(`/scenes/view`)
}

const handleSceneSelectChannel = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const crossfaderValue = getSceneCrossfaderValue(state)

  let channel
  if (p.type === 'active') {
    channel = crossfaderValue < 0.5 ? 'A' : 'B'
  } else if (p.type === 'opposite') {
    channel = crossfaderValue < 0.5 ? 'B' : 'A'
  }

  store.dispatch(
    rSceneSelectChannel(p.id, channel)
  )
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SCENE_CREATE':
      handleSceneCreate(action, store)
      break
    case 'U_SCENE_DELETE':
      handleSceneDelete(action, store)
      break
    case 'U_SCENE_SELECT_CHANNEL':
      handleSceneSelectChannel(action, store)
      break
    case 'SCENE_SKETCH_SELECT':
      handleSceneSketchSelect(action, store)
      break
  }
}
