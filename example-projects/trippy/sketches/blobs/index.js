const { MeshStandardMaterial, CubeCamera, Object3D } = require('three')
const { MarchingCubes } = require('three-addons')
const TWEEN = require('@tweenjs/tween.js')

class Blobs {
  constructor (world) {
    const { renderer, scene } = world

    this.root = new Object3D()
    const scale = 1000
    this.renderer = renderer
    this.scene = scene

    this.cubeCamera = new CubeCamera(1, 5000, 64)

    setTimeout(() => {
      this.cubeCamera.update(this.renderer, this.scene)
    }, 100)

    const mat = new MeshStandardMaterial(
      { color: 0xFFFFFF, envMap: this.cubeCamera.renderTarget, roughness: 0.1, metalness: 1.0 }
    )
    this.object = new MarchingCubes(32, mat, true, true)
    this.object.position.set(0, 0, 0)
    this.object.scale.set(scale, scale, scale)

    this.object.enableUvs = false
    this.object.enableColors = false

    this.group = new Object3D()
    this.group.add(this.cubeCamera)
    this.group.add(this.object)
    this.root.add(this.group)

    this.blobTime = 0

    this.props = {
      spinSpeed: 0
    }
  }

  spin () {
    this.isAnimating = true
    this.props.spinSpeed = 0.15

    new TWEEN.Tween(this.props)
      .to({ spinSpeed: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      .onComplete(() => {
        this.isAnimating = false
      })
  }

  updateReflection () {
    this.cubeCamera.update(this.renderer, this.scene)
  }

  update (params, time, frameDiff) {
    this.blobTime += ((params.blobSpeed * 2) - 1) * frameDiff / 7
    const object = this.object
    const numblobs = params.numBlobs * 50
    const rotSpeedZ = params.rotSpeedZ + this.props.spinSpeed

    object.reset()

    this.group.rotation.x += ((params.rotSpeedX * 2) - 1) * frameDiff
    this.group.rotation.y += ((params.rotSpeedY * 2) - 1) * frameDiff
    this.group.rotation.z += ((rotSpeedZ * 2) - 1) * frameDiff

    this.group.position.z = params.posZ * -10000

    // fill the field with some metaballs
    var i, ballx, bally, ballz, subtract, strength

    subtract = 12
    strength = (params.blobStrength * 3) / ((Math.sqrt(numblobs) - 1) / 4 + 1)

    for (i = 0; i < numblobs; i++) {
      ballx = Math.sin(i + 1.26 * this.blobTime * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5
      bally = Math.abs(Math.cos(i + 1.12 * this.blobTime * Math.cos(1.22 + 0.1424 * i))) * 0.27 + 0.5
      ballz = Math.cos(i + 1.32 * this.blobTime * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5

      object.addBall(ballx, bally, ballz, strength, subtract)
    }
  }
}

module.exports = Blobs
