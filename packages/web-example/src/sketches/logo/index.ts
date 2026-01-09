import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'
import hedronLogoUrl from './hedron-logo.glb'
import matcapUrl from './matcap.jpg'

const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const matcapMat = new THREE.MeshMatcapMaterial()
const sphereGeom = new THREE.IcosahedronGeometry(1, 3)

export default class Logo {
  root = new THREE.Group()
  sphere = new THREE.Mesh(sphereGeom, matcapMat)
  model?: THREE.Mesh

  constructor() {
    // Add inner sphere
    this.root.add(this.sphere)

    // Load logo model
    gltfLoader.load(hedronLogoUrl, (obj) => {
      this.model = obj.scene.getObjectByName('Hedron') as THREE.Mesh
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
    this.model.rotation.x += p.logoRotSpeedX * d * 0.3
    this.model.rotation.y += p.logoRotSpeedY * d * 0.3
    this.model.rotation.z += p.logoRotSpeedZ * d * 0.3

    // Logo Scale
    s = p.logoScale
    this.model.scale.set(s, s, s)

    // Inner sphere scale
    s = p.sphereScale
    this.sphere.scale.set(s, s, s)
  }
}
