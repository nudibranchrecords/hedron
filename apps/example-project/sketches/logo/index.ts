import './test.js'
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
  lastMatCapUrl?: string

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
    })
  }

  update({ params: p, deltaFrame: d }) {
    if (!this.model) return

    // TODO: We wouldn't need to check every frame if we had some sketch api for reacting to param changes
    if (p.matcapFileName && p.matcapFileName !== this.lastMatCapUrl) {
      this.lastMatCapUrl = p.matcapFileName
      textureLoader.load(p.matcapFileName, (matcap) => {
        matcapMat.matcap = matcap
        matcapMat.needsUpdate = true
      })
    }

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
