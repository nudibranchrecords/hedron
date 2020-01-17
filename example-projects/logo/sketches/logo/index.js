const { THREE, TWEEN } = window.HEDRON.dependencies
const loader = new THREE.GLTFLoader()

class Logo {
  constructor () {
    this.root = new THREE.Group()

    // Add lights
    this.aLight = new THREE.AmbientLight(null, 0.2)
    this.pLight = new THREE.PointLight(null, 3, 10)
    this.root.add(this.pLight)
    this.root.add(this.aLight)

    // Add inner sphere
    const sphereGeom = new THREE.IcosahedronBufferGeometry(1, 3)
    const sphereMat = new THREE.MeshBasicMaterial()
    this.sphere = new THREE.Mesh(sphereGeom, sphereMat)
    this.root.add(this.sphere)

    // Load logo model
    loader.load(`${__dirname}/hedron-logo.glb`, obj => {
      this.model = obj.scene.getObjectByName('Hedron')
      this.root.add(this.model)

      const s = 0.75
      this.model.scale.set(s, s, s)
      this.model.material = new THREE.MeshStandardMaterial({ color: 0xffffff })

      this.resetLogoRot()
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

    // Adjust colour of sphere and lighting
    this.pLight.color.setHSL(p.colorH, p.colorS, p.colorL)
    this.aLight.color.setHSL(p.colorH, p.colorS, p.colorL)
    this.sphere.material.color.setHSL(p.colorH, p.colorS, p.colorL)

    // Intensity of lighting
    this.aLight.intensity = p.aInt
    this.pLight.intensity = p.pInt

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
