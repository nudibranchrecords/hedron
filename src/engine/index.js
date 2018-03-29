import { loadSketches } from '../externals/sketches'
import getSketch from '../selectors/getSketch'
import getScenes from '../selectors/getScenes'
import getSketchParams from '../selectors/getSketchParams'
import getCurrentSceneId from '../selectors/getCurrentSceneId'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import { projectError } from '../store/project/actions'
import now from 'performance-now'
import renderer from './renderer'
import Scene from './Scene'

class Engine {
  constructor () {
    this.allModules = {}
    this.modules = {}
    this.sketches = []
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

  addSketchToScene (sceneId, sketchId, moduleId) {
    const meta = {
      sketchesFolder: `file://${this.sketchesFolder}`
    }

    const scene = this.scenes[sceneId].scene

    const module = new this.allModules[moduleId].Module(scene, meta)

    this.sketches.push({
      sceneId,
      sketchId,
      module
    })

    scene.add(module.root)
  }

  // removeSketch (id) {
  //   this.sketches.forEach((sketch, index) => {
  //     if (sketch.id === id) {
  //       this.sketches.splice(index, 1)
  //       world.scene.remove(sketch.module.root)
  //     }
  //   })
  // }

  fireShot (sketchId, method) {
    const state = this.store.getState()

    this.sketches.forEach((sketch) => {
      if (sketch.id === sketchId) {
        sketch.module[method](getSketchParams(state, sketch.id))
      }
    })
  }

  initiateScenes () {
    // Remove all sketches from world
    // this.sketches.forEach((sketch, index) => {
    //   world.scene.remove(sketch.module.root)
    // })
    const state = this.store.getState()
    const scenes = getScenes(state)

    this.scenes = {}

    // Add new ones
    scenes.forEach((scene) => {
      this.scenes[scene.id] = new Scene()
      scene.sketchIds.forEach(sketchId => {
        const moduleId = getSketch(state, sketchId).moduleId
        this.addSketchToScene(scene.id, sketchId, moduleId)
      })
    })

    renderer.setSize()
  }

  run (injectedStore, stats) {
    let tick = 0
    let oldTime = now()
    let elapsedFrames = 1
    let delta
    let newTime
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
        this.sketches.forEach(sketch => {
          const params = getSketchParams(state, sketch.sketchId)
          sketch.module.update(params, tick, elapsedFrames, allParams)
        })
        const scene = this.scenes[getCurrentSceneId(state)]
        if (scene) {
          renderer.render(scene)
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
