import allModules from 'sketches'
import updateSketch from './updateSketch'
import { sketchesModulesUpdate } from '../store/sketches/actions'

class Engine {
  constructor () {
    this.modules = allModules

    Object.keys(allModules).forEach((key) => {
      const module = new this.modules[key]()
      const meta = module.getMeta()
      this.modules[key] = {
        defaultTitle: meta.defaultTitle,
        params: meta.params
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
