import Test from 'sketches'
import updateSketch from './updateSketch'

class Engine {
  constructor () {
    this.sketches = [
      {
        id: 'sketch_1',
        module: new Test()
      },
      {
        id: 'sketch_2',
        module: new Test()
      }
    ]
  }

  run (store) {
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
