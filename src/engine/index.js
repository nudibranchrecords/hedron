import allModules from 'sketches'
import getSketchParams from './getSketchParams'
import checkSketches from './checkSketches'
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

  run (store) {
    // Give store module params
    store.dispatch(sketchesModulesUpdate(this.modules))

    const loop = () => {
      const state = store.getState()

      this.sketches = checkSketches(this.sketches, state)
      this.sketches.forEach(sketch => sketch.module.update(
        getSketchParams(sketch.id, state)
      ))

      world.render()

      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
