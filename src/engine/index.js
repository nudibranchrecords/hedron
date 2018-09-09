import { loadSketches } from '../externals/sketches'
import getSketch from '../selectors/getSketch'
import getScenes from '../selectors/getScenes'
import getScene from '../selectors/getScene'
import getSketchParams from '../selectors/getSketchParams'
import getSketchParamId from '../selectors/getSketchParamId'
import getChannelSceneId from '../selectors/getChannelSceneId'
import getSceneCrossfaderValue from '../selectors/getSceneCrossfaderValue'
import getViewerMode from '../selectors/getViewerMode'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import { projectError } from '../store/project/actions'
import now from 'performance-now'
import * as renderer from './renderer'
import Scene from './Scene'
import { nodeValuesBatchUpdate } from '../store/nodes/actions'

export let scenes = {}

let sketches = {}
let modules = {}
let isRunning = false
let allModules = {}
let sketchesFolder
let store

export const loadSketchModules = (url) => {
  try {
    sketchesFolder = url
    allModules = loadSketches(url)

    Object.keys(allModules).forEach((key) => {
      const config = allModules[key].config
      modules[key] = config
    })

    isRunning = true
  } catch (error) {
    isRunning = false
    console.error(error)
    store.dispatch(projectError(`Sketches failed to load: ${error.message}`, {
      popup: 'true',
      code: error.code
    }))
  }
}

export const addScene = (sceneId) => {
  scenes[sceneId] = new Scene()
  renderer.setSize()
}

export const removeScene = (sceneId) => {
  delete scenes[sceneId]
}

export const addSketchToScene = (sceneId, sketchId, moduleId) => {
  const meta = {
    sketchesFolder: `file://${sketchesFolder}`
  }

  const scene = scenes[sceneId]
  scene.renderer = renderer.renderer

  const state = store.getState()
  const params = getSketchParams(state, sketchId)

  const module = new allModules[moduleId].Module(scene, meta, params)

  sketches[sketchId] = module
  module.root && scene.scene.add(module.root)
}

export const removeSketchFromScene = (sceneId, sketchId) => {
  const sketch = sketches[sketchId]
  scenes[sceneId].scene.remove(sketch.root)
  if (sketch.destructor) {
    sketch.destructor(scenes[sceneId])
  }
  delete sketches[sketchId]
}

export const fireShot = (sketchId, method) => {
  const state = store.getState()

  if (sketches[sketchId][method]) {
    const params = sketches[sketchId][method](getSketchParams(state, sketchId))
    const vals = []
    if (params) {
      for (const key in params) {
        const id = getSketchParamId(state, sketchId, key)
        if (id != null) {
          vals.push(
            {
              id,
              value: params[key]
            }
          )
        }
      }
      if (vals.length) {
        store.dispatch(nodeValuesBatchUpdate(vals))
      }
    }
  }
}

export const initiateScenes = () => {
  const state = store.getState()
  const stateScenes = getScenes(state)

  // Clear scenes and sketches
  scenes = {}
  sketches = {}

  // Add new ones
  stateScenes.forEach((scene) => {
    addScene(scene.id)
    scene.sketchIds.forEach(sketchId => {
      const moduleId = getSketch(state, sketchId).moduleId
      addSketchToScene(scene.id, sketchId, moduleId)
    })
  })
}

export const run = (injectedStore, stats) => {
  let tick = 0
  let oldTimeModified = now()
  let oldTimeReal = now()
  let elapsedFrames = 1
  let delta, newTime, stateScene, sketch, state, spf, allParams
  const spf60 = 1000 / 60
  store = injectedStore
  isRunning = true
  renderer.initiate(injectedStore, scenes)
  // Give store module params
  store.dispatch(availableModulesReplaceAll(modules))

  const updateSceneSketches = (sceneId) => {
    stateScene = getScene(state, sceneId)
    if (stateScene) {
      stateScene.sketchIds.forEach(sketchId => {
        sketch = sketches[sketchId]
        const params = getSketchParams(state, sketchId)
        allParams = getSketchParams(state, null, sceneId)
        sketch.update(params, tick, elapsedFrames, allParams)
      })
    }
  }

  const loop = () => {
    requestAnimationFrame(loop)
    if (isRunning) {
      state = store.getState()
      spf = 1000 / state.settings.throttledFPS

      newTime = now()
      delta = newTime - oldTimeModified
      // Elapsed frames are from the perspective of a 60FPS target
      // regardless of throttling (so that throttled animations dont slow down)
      elapsedFrames = (newTime - oldTimeReal) / spf60
      tick += elapsedFrames

      if (delta > spf || state.settings.throttledFPS >= 60) {
        stats.begin()

        const channelA = getChannelSceneId(state, 'A')
        const channelB = getChannelSceneId(state, 'B')
        const mixRatio = getSceneCrossfaderValue(state)
        const viewerMode = getViewerMode(state)
        updateSceneSketches(channelA)
        updateSceneSketches(channelB)

        renderer.render(scenes[channelA], scenes[channelB], mixRatio, viewerMode)

        stats.end()

        // Must take remainder away when throttling FPS
        // http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
        oldTimeModified = newTime - (delta % spf)
        // Need real old time for calculating elapsed frames
        oldTimeReal = newTime
      }
    }
  }
  loop()
}

export const pause = () => {
  isRunning = false
}
