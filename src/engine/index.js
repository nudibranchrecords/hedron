import { getSketches } from '../externals/sketches'
import getSketchParams from '../selectors/getSketchParams'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import { projectError } from '../store/project/actions'
import now from 'performance-now'
import world from './world'

class Engine {
  constructor () {
    this.allModules = {}
    this.modules = {}
    this.sketches = []
    this.isRunning = false
  }

  loadSketchModules (url) {
    try {
      this.sketchesFolder = url
      this.allModules = getSketches(url)

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

  setCanvas (canvas) {
    this.canvas = canvas
  }

  addSketch (id, moduleId) {
    const meta = {
      sketchesFolder: `file://${this.sketchesFolder}`
    }

    const module = new this.allModules[moduleId].Module(world, meta)

    this.sketches.push({
      id,
      module
    })

    world.scene.add(module.root)
  }

  removeSketch (id) {
    this.sketches.forEach((sketch, index) => {
      if (sketch.id === id) {
        this.sketches.splice(index, 1)
        world.scene.remove(sketch.module.root)
      }
    })
  }

  fireShot (sketchId, method) {
    const state = this.store.getState()

    this.sketches.forEach((sketch) => {
      if (sketch.id === sketchId) {
        sketch.module[method](getSketchParams(state, sketch.id))
      }
    })
  }

  initiateSketches (sketches) {
    // Remove all sketches from world
    this.sketches.forEach((sketch, index) => {
      world.scene.remove(sketch.module.root)
    })
    this.sketches = []

    // Add new ones
    Object.keys(sketches).forEach((sketchId) => {
      const moduleId = sketches[sketchId].moduleId
      this.addSketch(sketchId, moduleId)
    })
  }

  run (injectedStore, stats) {
    let tick = 0
    let oldTime = now()
    let elapsedFrames = 1
    let newTime
    this.store = injectedStore
    this.isRunning = true

    // Give store module params
    this.store.dispatch(availableModulesReplaceAll(this.modules))

    const loop = () => {
      stats.begin()
      const spf = 1000 / 60
      const state = this.store.getState()
      const allParams = getSketchParams(state)

      this.sketches.forEach(sketch => {
        const params = getSketchParams(state, sketch.id)
        sketch.module.update(params, tick, elapsedFrames, allParams)
      })

      world.render()

      stats.end()
      newTime = now()
      elapsedFrames = (newTime - oldTime) / spf
      tick += elapsedFrames
      oldTime = newTime
      if (this.isRunning) {
        requestAnimationFrame(loop)
      }
    }
    loop()
  }

  pause () {
    this.isRunning = false
  }
}

export default new Engine()
