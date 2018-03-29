import * as THREE from 'three'

class Scene {
  constructor () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 16 / 9, 1, 1000000)
    this.camera.position.z = 1000
  }
}

export default Scene
