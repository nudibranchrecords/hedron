import * as THREE from 'three'

class World {
  setScene (canvas) {
    if (!this.canvas) {
      this.canvas = canvas
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
      this.camera.position.z = 1000
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    }
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}

export default new World()
