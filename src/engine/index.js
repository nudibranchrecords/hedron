import path from 'path'
import { loadSketches, loadSketch, loadConfig } from '../externals/sketches'
import getSketch from '../selectors/getSketch'
import getScenes from '../selectors/getScenes'
import getScene from '../selectors/getScene'
import getSketchParams from '../selectors/getSketchParams'
import getSketchParamId from '../selectors/getSketchParamId'
import getChannelSceneId from '../selectors/getChannelSceneId'
import getSceneCrossfaderValue from '../selectors/getSceneCrossfaderValue'
import getViewerMode from '../selectors/getViewerMode'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import { projectError, projectSketchesPathUpdate } from '../store/project/actions'
import now from 'performance-now'
import * as renderer from './renderer'
import Scene from './Scene'
import { nodeValuesBatchUpdate } from '../store/nodes/actions'
import TWEEN from '@tweenjs/tween.js'
import { getProjectFilepath } from '../store/project/selectors'

export let scenes = {}

let sketches = {}
let moduleConfigs = {}
let isRunning = false
let moduleFiles = {}
let sketchesFolder
let store

// Load sketches from sketches folder
export const loadSketchModules = (url) => {
  let hasCheckedForSiblingDir = false

  const load = url => {
    try {
      sketchesFolder = url
      moduleFiles = loadSketches(url)

      Object.keys(moduleFiles).forEach((key) => {
        moduleConfigs[key] = moduleFiles[key].config
      })

      isRunning = true

      // If second check inside sibling sketches folder was successful, save the absolute path
      if (hasCheckedForSiblingDir) {
        store.dispatch(projectSketchesPathUpdate(url))
      }
    } catch (error) {
      if (!hasCheckedForSiblingDir) {
        // If can't find sketches folder, try looking for "sketches" folder next to project.json first
        hasCheckedForSiblingDir = true
        // eslint-disable-next-line no-console
        console.log(
          `%cHEDRON: Can't find sketches folder for project. %c\nChecking for sibling folder named "sketches"`,
          `font-weight: bold`,
          `font-weight: normal`,
        )
        // Generate file path for sibling folder and try again
        const state = store.getState()
        const filePath = getProjectFilepath(state)
        const sketchesPath = path.resolve(path.dirname(filePath), 'sketches/')
        load(sketchesPath)
      } else {
        // If all else fails, throw error
        isRunning = false
        console.error(error)
        store.dispatch(projectError(`Sketches failed to load: ${error.message}`, {
          popup: 'true',
          code: error.code,
        }))
      }
    }
  }

  load(url)
}

export const reloadSingleSketchModule = (url, moduleId, pathArray) => {
  try {
    moduleFiles[moduleId] = loadSketch(url)
    moduleConfigs[moduleId] = moduleFiles[moduleId].config
    moduleConfigs[moduleId].filePathArray = pathArray
    moduleConfigs[moduleId].filePath = url
  } catch (error) {
    isRunning = false
    console.error(error)
    store.dispatch(projectError(`Sketch ${moduleId} failed to load: ${error.message}`, {
      popup: 'true',
      code: error.code,
    }))
  }
}

export const reloadSingleSketchConfig = (url, moduleId, pathArray) => {
  try {
    moduleConfigs[moduleId] = loadConfig(url)
    moduleConfigs[moduleId].filePathArray = pathArray
    moduleConfigs[moduleId].filePath = url
  } catch (error) {
    isRunning = false
    console.error(error)
    store.dispatch(projectError(`Sketch config ${moduleId} failed to load: ${error.message}`, {
      popup: 'true',
      code: error.code,
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
    sketchesFolder: `file://${sketchesFolder}`,
  }

  const scene = scenes[sceneId]
  scene.renderer = renderer.renderer

  const state = store.getState()
  const params = getSketchParams(state, sketchId)

  const module = new moduleFiles[moduleId].Module(scene, params, meta)

  // Do any postprocessing related setup for this sketch
  if (module.initiatePostProcessing) {
    module.outputPass = module.initiatePostProcessing(renderer.composer)
  }

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
              value: params[key],
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

  // Output passes for postprocessing related sketches
  const passes = []

  // Add new scenes and sketches
  stateScenes.forEach(scene => {
    addScene(scene.id)
    scene.sketchIds.forEach((sketchId, index) => {
      const moduleId = getSketch(state, sketchId).moduleId
      addSketchToScene(scene.id, sketchId, moduleId)

      // If sketch has an output pass, add to array
      const outputPass = sketches[sketchId].outputPass
      if (outputPass) passes.push(outputPass)
    })
  })

  // Set last item of output passes to render to the screen
  if (passes.length) {
    renderer.mainPass.renderToScreen = false
    passes[passes.length - 1].renderToScreen = true
  }
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
  store.dispatch(availableModulesReplaceAll(moduleConfigs))

  const updateSceneSketches = (sceneId) => {
    stateScene = getScene(state, sceneId)
    if (stateScene) {
      stateScene.sketchIds.forEach(sketchId => {
        sketch = sketches[sketchId]
        const params = getSketchParams(state, sketchId)
        allParams = getSketchParams(state, null, sceneId)
        if (sketch.update) sketch.update(params, tick, elapsedFrames, allParams)
      })
    }
  }

  const loop = () => {
    requestAnimationFrame(loop)
    if (isRunning) {
      state = store.getState()
      spf = 1000 / state.settings.throttledFPS

      newTime = now()

      // Tween JS used for animated param values (anims)
      TWEEN.update(newTime)

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

        renderer.render(scenes[channelA], scenes[channelB], mixRatio, viewerMode, delta)

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
