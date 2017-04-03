import allModules from 'sketches'
import updateSketch from './updateSketch'
import checkSketches from './checkSketches'
import { sketchesModulesUpdate } from '../store/sketches/actions'
import World from './World'

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
        updateSketch(sketch.id, state)
      ))

      World.render()

      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
