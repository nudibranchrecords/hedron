import allModules from '../externals/sketches'
import getSketchParams from './getSketchParams'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import world from './world'

let store

class Engine {
  constructor () {
    this.modules = {}

    Object.keys(allModules).forEach((key) => {
      const config = allModules[key].config
      this.modules[key] = config
    })

    this.sketches = []
  }

  setCanvas (canvas) {
    this.canvas = canvas
  }

  addSketch (id, moduleId) {
    const module = new allModules[moduleId].Module(world)

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
    const state = store.getState()

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
    store = injectedStore

    // Give store module params
    store.dispatch(availableModulesReplaceAll(this.modules))

    const loop = () => {
      stats.begin()

      const state = store.getState()

      this.sketches.forEach(sketch => sketch.module.update(
        getSketchParams(state, sketch.id)
      ))

      world.render()

      stats.end()
      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
