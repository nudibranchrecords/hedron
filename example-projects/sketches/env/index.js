const { THREE } = window.HEDRON.dependencies

class Env {
  constructor ({ scene }) {
    this.scene = scene
    this.clearColor = new THREE.Color()
    this.fog = new THREE.FogExp2()
    scene.fog = this.fog
  }

  update ({ params: p }) {
    this.clearColor.setHSL(p.colorH, p.colorS, p.colorL)
    this.scene.background = this.clearColor
    this.fog.color = this.clearColor
    this.fog.density = p.fogDensity
  }
}

module.exports = Env
