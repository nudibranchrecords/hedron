import uid from 'uid'
import { rSceneCreate, rSceneDelete, rSceneSelectCurrent, rSceneSelectChannel,
  uSceneSelectChannel, sceneClearChannel, rScenesReorder, rSceneSketchesReorder, rSceneSettingsUpdate } from './actions'
import { generateSceneLinkableActionIds } from './utils'
import { engineSceneAdd, engineSceneRemove } from '../../engine/actions'
import { uSketchDelete } from '../sketches/actions'
import { uiEditingOpen, uiNodeClose } from '../ui/actions'
import getScene from '../../selectors/getScene'
import getScenes from '../../selectors/getScenes'
import getChannelSceneId from '../../selectors/getChannelSceneId'
import getSceneCrossfaderValue from '../../selectors/getSceneCrossfaderValue'
import history from '../../history'
import { rNodeCreate, uNodeDelete } from '../nodes/actions'
import { setPostProcessing } from '../../engine/renderer'
import * as engine from '../../engine'

const handleSceneCreate = (action, store) => {
  const state = store.getState()
  const allScenes = getScenes(state)
  const id = uid()

  const la = generateSceneLinkableActionIds(id)

  const linkableActionIds = {}

  for (const key in la) {
    const node = {
      type: 'linkableAction',
      action: la[key].action,
      title: la[key].title,
    }
    store.dispatch(rNodeCreate(la[key].id, node))
    linkableActionIds[key] = la[key].id
  }

  const scene = {
    id,
    title: 'New Scene',
    selectedSketchId: false,
    sketchIds: [],
    linkableActionIds,
    settings: {},
  }

  store.dispatch(rSceneCreate(id, scene))
  store.dispatch(engineSceneAdd(id))

  store.dispatch(rSceneSelectCurrent(id))

  if (allScenes.length === 0) {
    store.dispatch(uSceneSelectChannel(id, 'A'))
  }

  history.push(`/scenes/view`)
  store.dispatch(uiEditingOpen('sceneTitle', id))
}

const handleSceneDelete = (action, store) => {
  const p = action.payload
  let state = store.getState()
  const scene = getScene(state, p.id)

  // Delete sketches
  scene.sketchIds.forEach(sketchId => {
    // We're skipping postprocessing reset to stop it happening multiple times per sketch
    // Instead it is called once after scene is deleted
    store.dispatch(uSketchDelete(sketchId, p.id, { skipPostProcessingReset: true }))
  })

  // Delete linkableActions
  for (const key in scene.linkableActionIds) {
    const id = scene.linkableActionIds[key]
    store.dispatch(uNodeDelete(id))
  }

  store.dispatch(sceneClearChannel(p.id))

  store.dispatch(rSceneDelete(p.id))
  store.dispatch(engineSceneRemove(p.id))
  state = store.getState()
  const scenes = getScenes(state)
  const lastScene = scenes[scenes.length - 1]
  let url = lastScene ? `/scenes/view` : '/'

  store.dispatch(rSceneSelectCurrent(lastScene ? lastScene.id : false))
  history.push(url)

  setPostProcessing()
}

const handleSceneSelectCurrent = (action, store) => {
  const p = action.payload

  store.dispatch(rSceneSelectCurrent(p.id))
  // To stop user confusion, close the left-hand panel on scene change
  // because it will be displaying properties for an action related to another scene
  store.dispatch(uiNodeClose())
}

const handleSceneSketchSelect = (action, store) => {
  history.push(`/scenes/view`)
}

const handleSceneSelectChannel = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const crossfaderValue = getSceneCrossfaderValue(state)

  let channel
  if (p.channel === 'active') {
    channel = crossfaderValue < 0.5 ? 'A' : 'B'
  } else if (p.channel === 'opposite') {
    channel = crossfaderValue < 0.5 ? 'B' : 'A'
  } else if (p.channel === 'A' || p.channel === 'B') {
    channel = p.channel
  }

  const otherChannel = channel === 'A' ? 'B' : 'A'
  const otherChannelId = state.scenes.channels[otherChannel]

  if (otherChannelId === p.id) {
    // If opposite channel has same scene as newly switched channel, remove scene
    store.dispatch(rSceneSelectChannel(false, otherChannel))
    engine.channelUpdate(null, otherChannel)
  }

  store.dispatch(rSceneSelectChannel(p.id, channel))
  engine.channelUpdate(p.id, channel)
}

const handleSceneClearChannel = (action, store) => {
  const state = store.getState()
  const p = action.payload
  const channels = ['A', 'B']

  // If scene is in a channel, take it off
  channels.forEach(channel => {
    const id = getChannelSceneId(state, channel)
    if (id === p.id) store.dispatch(uSceneSelectChannel(false, channel))
  })
}

const handleScenesReorder = (action, store) => {
  const p = action.payload

  store.dispatch(rScenesReorder(p.oldIndex, p.newIndex))
  setPostProcessing()
}

const handleSceneSketchesReorder = (action, store) => {
  const p = action.payload

  store.dispatch(rSceneSketchesReorder(p.id, p.oldIndex, p.newIndex))
  setPostProcessing()
}

const handleSceneSettingsUpdate = (action, store) => {
  const p = action.payload

  store.dispatch(rSceneSettingsUpdate(p.id, p.settings))
  setPostProcessing()
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SCENE_CREATE':
      handleSceneCreate(action, store)
      break
    case 'U_SCENE_DELETE':
      handleSceneDelete(action, store)
      break
    case 'U_SCENE_SELECT_CURRENT':
      handleSceneSelectCurrent(action, store)
      break
    case 'U_SCENE_SELECT_CHANNEL':
      handleSceneSelectChannel(action, store)
      break
    case 'U_SCENES_REORDER':
      handleScenesReorder(action, store)
      break
    case 'U_SCENE_SKETCHES_REORDER':
      handleSceneSketchesReorder(action, store)
      break
    case 'U_SCENE_SETTINGS_UPDATE':
      handleSceneSettingsUpdate(action, store)
      break
    case 'SCENE_SKETCH_SELECT':
      handleSceneSketchSelect(action, store)
      break
    case 'SCENE_CLEAR_CHANNEL':
      handleSceneClearChannel(action, store)
      break
  }
}
