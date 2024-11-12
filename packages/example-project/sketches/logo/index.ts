import './test.js'
import hedronLogoUrl from './hedron-logo.glb'
import matcapUrl from './matcap.jpg'

const { THREE, THREE_EXTRAS } = window.HEDRON.dependencies
const { GLTFLoader } = THREE_EXTRAS

const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const matcapMat = new THREE.MeshMatcapMaterial()
const sphereGeom = new THREE.IcosahedronGeometry(1, 3)

export default class Logo {
  constructor() {
    this.root = new THREE.Group()
    // Add inner sphere
    this.sphere = new THREE.Mesh(sphereGeom, matcapMat)
    this.root.add(this.sphere)

    // Load logo model
    gltfLoader.load(hedronLogoUrl, (obj) => {
      this.model = obj.scene.getObjectByName('Hedron')
      this.model.material = matcapMat
      this.root.add(this.model)

      const s = 0.5
      this.model.scale.set(s, s, s)

      textureLoader.load(matcapUrl, (matcap) => {
        matcapMat.matcap = matcap
        matcapMat.needsUpdate = true
      })
    })
  }

  update({ params: p, deltaFrame: d }) {
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
