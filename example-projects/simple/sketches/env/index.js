const THREE = require('three')

class Env {
  constructor (scene) {
    this.scene = scene.scene
    this.clearColor = new THREE.Color()
  }

  update (p) {
    this.clearColor.setHSL(p.colorH, p.colorS, p.colorL)
    this.scene.background = this.clearColor
  }
}

module.exports = Env
