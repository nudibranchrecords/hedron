const { THREE, TWEEN } = window.HEDRON.dependencies
const gltfLoader = new THREE.GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const matcapMat = new THREE.MeshMatcapMaterial()

class Logo {
  constructor ({ sketchesDir }) {
    const dir = `${sketchesDir}/logo`
    this.root = new THREE.Group()

    // Add inner sphere
    const sphereGeom = new THREE.IcosahedronBufferGeometry(1, 3)
    this.sphere = new THREE.Mesh(sphereGeom, matcapMat)
    this.root.add(this.sphere)

    // Load logo model
    gltfLoader.load(`${dir}/hedron-logo.glb`, obj => {
      this.model = obj.scene.getObjectByName('Hedron')
      this.model.material = matcapMat
      this.root.add(this.model)

      const s = 0.75
      this.model.scale.set(s, s, s)
      this.resetLogoRot()

      textureLoader.load(`${dir}/matcap.jpg`, matcap => {
        matcapMat.matcap = matcap
        matcapMat.needsUpdate = true
      })
    })
  }

  resetLogoRot () {
    // Using tween.js to animate the rotation back to default
    this.isTweeningRot = true
    const currRot = this.model.rotation
    this.props = {
      rotX: currRot.x,
      rotY: currRot.y,
      rotZ: currRot.z,
    }
    new TWEEN.Tween(this.props)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .to({
        rotX: 0.15,
        rotY: 0,
        rotZ: 0,
      }, 1000)
      .onComplete(() => {
        this.isTweeningRot = false
      })
      .start()
  }

  update ({ params: p, deltaFrame: d }) {
    if (!this.model) return

    let s

    // Logo Rotation
    if (this.isTweeningRot) {
      this.model.rotation.x = this.props.rotX
      this.model.rotation.y = this.props.rotY
      this.model.rotation.z = this.props.rotZ
    } else {
      this.model.rotation.x += p.logoRotSpeedX * d * 0.3
      this.model.rotation.y += p.logoRotSpeedY * d * 0.3
      this.model.rotation.z += p.logoRotSpeedZ * d * 0.3
    }

    // Logo Scale
    s = p.logoScale
    this.model.scale.set(s, s, s)

    // Inner sphere scale
    s = p.sphereScale
    this.sphere.scale.set(s, s, s)
  }
}

module.exports = Logo
