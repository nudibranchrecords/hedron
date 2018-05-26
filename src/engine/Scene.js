import * as THREE from 'three'

class Scene {
  constructor () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, null, 1, 1000000)
    this.camera.position.z = 1000
  }

  setRatio (ratio) {
    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }
}

export default Scene
