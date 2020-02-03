const { THREE } = window.HEDRON.dependencies

class Env {
  constructor ({ scene }) {
    this.scene = scene
    this.clearColor = new THREE.Color()
  }

  update ({ params: p }) {
    this.clearColor.setHSL(p.colorH, p.colorS, p.colorL)
    this.scene.background = this.clearColor
  }
}

module.exports = Env
