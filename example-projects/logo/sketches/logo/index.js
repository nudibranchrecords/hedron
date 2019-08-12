const loader = new THREE.GLTFLoader()

class Logo {
  constructor (scene) {
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
    this.model.rotation.set(0.15, 0, 0)
  }

  update (p, t, f) {
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
    this.model.rotation.x += p.logoRotSpeedX * f * 0.3
    this.model.rotation.y += p.logoRotSpeedY * f * 0.3
    this.model.rotation.z += p.logoRotSpeedZ * f * 0.3

    // Logo Scale
    s = p.logoScale
    this.model.scale.set(s, s, s)

    // Inner sphere scale
    s = p.sphereScale
    this.sphere.scale.set(s, s, s)
  }
}

module.exports = Logo
