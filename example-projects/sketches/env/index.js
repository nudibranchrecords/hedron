const { THREE } = window.HEDRON.dependencies

class Env {
  constructor ({ scene }) {
    this.scene = scene
    this.clearColor = new THREE.Color()
    this.fog = new THREE.FogExp2()
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.directionalLight.position.set(0.5, 0.5, 0.5)

    this.root = new THREE.Group()

    scene.fog = this.fog
    this.root.add(this.directionalLight)
    this.root.add(this.ambientLight)
  }

  update ({ params: p }) {
    this.clearColor.setHSL(p.colorH, p.colorS, p.colorL)
    this.scene.background = this.clearColor
    this.fog.color = this.clearColor
    this.fog.density = p.fogDensity
  }
}

module.exports = Env
