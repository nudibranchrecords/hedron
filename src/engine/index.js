import { loadSketches } from '../externals/sketches'
import getSketch from '../selectors/getSketch'
import getScenes from '../selectors/getScenes'
import getSketchParams from '../selectors/getSketchParams'
import getCurrentScene from '../selectors/getCurrentScene'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import { projectError } from '../store/project/actions'
import now from 'performance-now'
import renderer from './renderer'
import Scene from './Scene'

class Engine {
  constructor () {
    this.allModules = {}
    this.modules = {}
    this.sketches = {}
    this.scenes = {}
    this.isRunning = false
  }

  loadSketchModules (url) {
    try {
      this.sketchesFolder = url
      this.allModules = loadSketches(url)

      Object.keys(this.allModules).forEach((key) => {
        const config = this.allModules[key].config
        this.modules[key] = config
      })
    } catch (error) {
      console.error(error)
      this.store.dispatch(projectError(`Sketches failed to load: ${error.message}`, {
        popup: 'true',
        type: 'badSketchFolder'
      }))
    }
  }

  addScene (sceneId) {
    this.scenes[sceneId] = new Scene()
    renderer.setSize()
  }

  removeScene (sceneId) {
    delete this.scenes[sceneId]
  }

  addSketchToScene (sceneId, sketchId, moduleId) {
    const meta = {
      sketchesFolder: `file://${this.sketchesFolder}`
    }

    const scene = this.scenes[sceneId]
    const module = new this.allModules[moduleId].Module(scene, meta)

    this.sketches[sketchId] = module
    scene.scene.add(module.root)
  }

  removeSketchFromScene (sceneId, sketchId) {
    const sketch = this.sketches[sketchId]
    this.scenes[sceneId].scene.remove(sketch.root)
    delete this.sketches[sketchId]
  }

  fireShot (sketchId, method) {
    const state = this.store.getState()
    this.sketches[sketchId][method](getSketchParams(state, sketchId))
  }

  initiateScenes () {
    const state = this.store.getState()
    const scenes = getScenes(state)

    // Clear scenes and sketches
    this.scenes = {}
    this.sketches = {}

    // Add new ones
    scenes.forEach((scene) => {
      this.addScene(scene.id)
      scene.sketchIds.forEach(sketchId => {
        const moduleId = getSketch(state, sketchId).moduleId
        this.addSketchToScene(scene.id, sketchId, moduleId)
      })
    })
  }

  run (injectedStore, stats) {
    let tick = 0
    let oldTime = now()
    let elapsedFrames = 1
    let delta
    let newTime
    let stateScene
    let sketch
    this.store = injectedStore
    this.isRunning = true
    renderer.initiate(injectedStore, this.scenes)
    // Give store module params
    this.store.dispatch(availableModulesReplaceAll(this.modules))

    const loop = () => {
      if (this.isRunning) {
        requestAnimationFrame(loop)
      }
      const state = this.store.getState()
      const spf = 1000 / state.settings.throttledFPS
      const allParams = getSketchParams(state)

      newTime = now()
      delta = newTime - oldTime
      elapsedFrames = delta / spf
      tick += elapsedFrames
      oldTime = newTime - (delta % spf)

      if (delta > spf || state.settings.throttledFPS >= 60) {
        stats.begin()
        stateScene = getCurrentScene(state)
        if (stateScene) {
          stateScene.sketchIds.forEach(sketchId => {
            sketch = this.sketches[sketchId]
            const params = getSketchParams(state, sketchId)
            sketch.update(params, tick, elapsedFrames, allParams)
          })
          renderer.render(this.scenes[stateScene.id])
        }

        stats.end()
      }
    }
    loop()
  }

  pause () {
    this.isRunning = false
  }
}

export default new Engine()
