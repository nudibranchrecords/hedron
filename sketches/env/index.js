const Sketch = require('../../src/Engine/Sketch.js')

class Env extends Sketch {

  constructor (world) {
    super()
    this.world = world
  }

  update (params) {
    this.world.scene.fog.density = params.fogDensity * 0.01
  }
}

module.exports = Env
