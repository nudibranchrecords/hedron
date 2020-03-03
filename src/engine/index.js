import path from 'path'
import TWEEN from '@tweenjs/tween.js'
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
import * as renderer from './renderer'
import Scene from './Scene'
import { nodeValuesBatchUpdate } from '../store/nodes/actions'
import { getProjectFilepath } from '../store/project/selectors'

const configDefault = {
  defaultTitle: 'Sketch',
  params: [],
  shots: [],
}

export let scenes = {}
export let sketches = {}
export let sketchesDir

let moduleConfigs = {}
let isRunning = false
let moduleFiles = {}

let store

// Load sketches from sketches folder
export const loadSketchModules = (url, { siblingCheck = false } = {}) => {
  let hasCheckedForSiblingDir = !siblingCheck

  const load = url => {
    try {
      isRunning = true

      sketchesDir = url
      moduleFiles = loadSketches(url)

      Object.keys(moduleFiles).forEach((key) => {
        moduleConfigs[key] = moduleFiles[key].config
      })
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
        if (filePath) {
          const sketchesPath = path.resolve(path.dirname(filePath), 'sketches/')
          load(sketchesPath)
        } else {
          isRunning = false
          throw error
        }
      } else {
        // If all else fails, throw error
        isRunning = false
        throw error
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
    store.dispatch(
      projectError(
        `Sketch ${moduleId} failed to load: ${error.message}`,
        {
          popup: 'true',
          code: error.code,
        }
      )
    )
  }
}

export const reloadSingleSketchConfig = (url, moduleId, pathArray) => {
  try {
    moduleConfigs[moduleId] = {
      ...configDefault,
      ...loadConfig(url),
    }
    moduleConfigs[moduleId].filePathArray = pathArray
    moduleConfigs[moduleId].filePath = url
  } catch (error) {
    isRunning = false
    console.error(error)
    store.dispatch(
      projectError(
        `Sketch config ${moduleId} failed to load: ${error.message}`,
        {
          popup: 'true',
          code: error.code,
        }
      )
    )
  }
}

export const addScene = (sceneId, shouldSetPost = true) => {
  scenes[sceneId] = new Scene()
  renderer.setSize()
  if (shouldSetPost) renderer.setPostProcessing()
}

export const removeScene = (sceneId, shouldSetPost) => {
  delete scenes[sceneId]
  if (shouldSetPost) renderer.setPostProcessing()
}

export const addSketchToScene = (sceneId, sketchId, moduleId, shouldSetPost = true) => {
  const scene = scenes[sceneId]
  const state = store.getState()
  const params = getSketchParams(state, sketchId)

  const module = new moduleFiles[moduleId].Module({
    scene: scene.scene,
    camera: scene.camera,
    params,
    sketchesDir: `file://${sketchesDir}`,
    renderer: renderer.renderer,
    outputSize: renderer.size,
  })

  sketches[sketchId] = module
  if (module.root) scene.scene.add(module.root)

  if (shouldSetPost) renderer.setPostProcessing()
}

export const removeSketchFromScene = (sceneId, sketchId, shouldSetPost) => {
  const scene = scenes[sceneId]
  const sketch = sketches[sketchId]

  scenes[sceneId].scene.remove(sketch.root)

  if (sketch.destructor) {
    sketch.destructor({
      scene: scene.scene,
      camera: scene.camera,
      sketchesDir: `file://${sketchesDir}`,
      renderer: renderer.renderer,
    })
  }

  delete sketches[sketchId]

  if (shouldSetPost) renderer.setPostProcessing()
}

export const fireShot = (sketchId, method) => {
  const state = store.getState()

  if (sketches[sketchId][method]) {
    const params = getSketchParams(state, sketchId)
    const changedParams = sketches[sketchId][method]({ params })
    const vals = []
    if (changedParams) {
      for (const key in changedParams) {
        const id = getSketchParamId(state, sketchId, key)
        if (id != null) {
          vals.push(
            {
              id,
              value: changedParams[key],
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

  // Add new scenes and sketches
  stateScenes.forEach(scene => {
    addScene(scene.id, false)
    scene.sketchIds.forEach((sketchId, index) => {
      const moduleId = getSketch(state, sketchId).moduleId
      addSketchToScene(scene.id, sketchId, moduleId, false)
    })
  })

  renderer.setPostProcessing()
}

export const channelUpdate = (sceneId, channel) => {
  renderer.channelUpdate(sceneId, channel)
}

export const run = (injectedStore, stats) => {
  let tick = 0
  let elapsedFrames = 0
  let oldTimeModifiedMs = performance.now()
  let oldTimeRealMs = performance.now()
  let deltaFrame = 1
  let deltaMs, newTimeMs, stateScene, sketch, state, spf, allParams
  const spf60 = 1000 / 60
  store = injectedStore
  isRunning = true
  renderer.initiate(injectedStore, scenes)
  // Give store module params
  store.dispatch(availableModulesReplaceAll(moduleConfigs))

  const getInfo = () => ({
    allParams,
    elapsedFrames,
    elapsedTimeMs: newTimeMs,
    deltaMs,
    deltaFrame,
    tick,
    outputSize: renderer.size,
  })

  const updateSceneSketches = (sceneId) => {
    stateScene = getScene(state, sceneId)
    if (stateScene) {
      stateScene.sketchIds.forEach(sketchId => {
        sketch = sketches[sketchId]
        const params = getSketchParams(state, sketchId)
        allParams = getSketchParams(state, null, sceneId)
        if (sketch.update && !stateScene.settings.globalPostProcessingEnabled) sketch.update({ ...getInfo(), params })
      })
    }
  }

  const updateGlobalPostProcessingSketches = () => {
    const scenes = getScenes(state)

    scenes.forEach(scene => {
      if (scene.settings.globalPostProcessingEnabled) {
        allParams = getSketchParams(state, null, scene.id)
        scene.sketchIds.forEach(sketchId => {
          sketch = sketches[sketchId]
          const params = getSketchParams(state, sketchId)
          if (sketch.update) sketch.update({ ...getInfo(), params })
        })
      }
    })
  }

  const loop = () => {
    requestAnimationFrame(loop)
    if (isRunning) {
      tick++
      state = store.getState()
      spf = 1000 / state.settings.throttledFPS

      newTimeMs = performance.now()

      // Tween JS used for animated param values (anims)
      TWEEN.update(newTimeMs)

      deltaMs = newTimeMs - oldTimeModifiedMs
      // Elapsed frames are from the perspective of a 60FPS target
      // regardless of throttling (so that throttled animations dont slow down)
      deltaFrame = (newTimeMs - oldTimeRealMs) / spf60
      elapsedFrames += deltaFrame

      if (deltaMs > spf || state.settings.throttledFPS >= 60) {
        stats.begin()

        const channelA = getChannelSceneId(state, 'A')
        const channelB = getChannelSceneId(state, 'B')
        const mixRatio = getSceneCrossfaderValue(state)
        const viewerMode = getViewerMode(state)
        updateSceneSketches(channelA)
        updateSceneSketches(channelB)
        updateGlobalPostProcessingSketches()

        renderer.render(mixRatio, viewerMode, deltaMs)

        stats.end()

        // Must take remainder away when throttling FPS
        // http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
        oldTimeModifiedMs = newTimeMs - (deltaMs % spf)
        // Need real old time for calculating elapsed frames
        oldTimeRealMs = newTimeMs
      }
    }
  }
  loop()
}

export const pause = () => {
  isRunning = false
}
