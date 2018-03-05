const THREE = require('three')

class Env {
  constructor (world) {
    this.root = new THREE.Object3D()
    this.world = world

    this.clearColor = new THREE.Color()
    this.world.scene.fog = new THREE.FogExp2()

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    this.directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7)
    this.directionalLight2 = new THREE.DirectionalLight(0x256351, 0.7)
    this.directionalLight1.position.set(1, 1, 1)
    this.directionalLight1.position.set(-0.5, 0.5, 0.5)

    this.centralPointLight = new THREE.PointLight(0xffffff, 1, 10000)
    // this.centralPointLight.position.z = -1000
    this.world.scene.add(this.centralPointLight)

    this.world.scene.add(this.directionalLight1)
    this.world.scene.add(this.directionalLight2)
    this.world.scene.add(this.ambientLight)

    this.props = {}

    this.pointLightTick = 0

    this.camera1()
  }

  cameraMove (x, y, z) {
    this.world.camera.position.x = x
    this.world.camera.position.y = y
    this.world.camera.position.z = z
    this.world.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  camera1 () {
    this.cameraMove(0, 0, 1000)
  }

  camera2 () {
    this.cameraMove(500, -500, 1000)
  }

  camera3 () {
    this.cameraMove(-500, 500, 500)
  }

  cameraRandom () {
    const a = [500, -500, 800, -800, 1000, -1000]
    const r = () => Math.floor(Math.random() * a.length)
    this.cameraMove(a[r()], a[r()], a[r()])
  }

  update (p, t) {
    this.clearColor.setHSL(p.colorH, p.colorS, p.colorL)
    this.world.scene.fog.density = p.fogDensity * 0.01
    this.world.scene.fog.color = this.clearColor
    this.world.scene.background = this.clearColor

    this.directionalLight1.intensity = 0.7 * p.mainLightIntensity
    this.directionalLight2.intensity = 0.7 * p.mainLightIntensity
    this.ambientLight.intensity = 0.3 * p.mainLightIntensity

    this.centralPointLight.color.setHSL(p.centralPointLightH, p.centralPointLightS, p.centralPointLightL)
    this.centralPointLight.distance = Math.max(p.centralPointLightDistance * 30000, 0.001)
    this.centralPointLight.intensity = p.centralPointLightIntensity * 10
  }
}

module.exports = Env
