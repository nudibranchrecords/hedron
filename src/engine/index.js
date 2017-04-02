import allModules from 'sketches'
import updateSketch from './updateSketch'
import { sketchesModulesUpdate } from '../store/sketches/actions'

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

  // Check and update sketch list if changed
  checkSketches (state) {
    const sketchKeys = Object.keys(state.sketches.instances)

    if (this.sketches.length !== sketchKeys.length) {
      const key = sketchKeys[this.sketches.length]
      const newSketch = state.sketches.instances[key]
      const moduleId = newSketch.moduleId

      this.sketches.push({
        id: key,
        module: new allModules[moduleId].Module()
      })
    }
  }

  run (store) {
    // Give store module params
    store.dispatch(sketchesModulesUpdate(this.modules))

    const loop = () => {
      const state = store.getState()

      this.checkSketches(state)
      this.sketches.forEach(sketch => sketch.module.update(
        updateSketch(sketch.id, state)
      ))

      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
