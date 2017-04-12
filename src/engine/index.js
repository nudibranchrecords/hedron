import allModules from 'sketches'
import getSketchParams from './getSketchParams'
import { sketchesModulesUpdate } from '../store/sketches/actions'
import world from './world'

class Engine {
  constructor () {
    this.modules = {}

    Object.keys(allModules).forEach((key) => {
      const params = allModules[key].params
      this.modules[key] = {
        defaultTitle: params.defaultTitle,
        params: params.params
      }
    })

    this.sketches = []
  }

  setCanvas (canvas) {
    this.canvas = canvas
  }

  addSketch (id, moduleId) {
    const module = new allModules[moduleId].Module()

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

  run (store, stats) {
    // Give store module params
    store.dispatch(sketchesModulesUpdate(this.modules))

    const loop = () => {
      stats.begin()

      const state = store.getState()

      // this.sketches = checkSketches(this.sketches, state)
      this.sketches.forEach(sketch => sketch.module.update(
        getSketchParams(sketch.id, state)
      ))

      world.render()

      stats.end()
      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
