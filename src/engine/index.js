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

  run (store) {
    store.dispatch(sketchesModulesUpdate(this.modules))

    const loop = () => {
      const state = store.getState()
      this.sketches.forEach(sketch => sketch.module.update(
        updateSketch(sketch.id, state)
      ))
      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
