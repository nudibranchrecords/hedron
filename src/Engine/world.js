import * as THREE from 'three'

class World {
  setScene (canvas) {
    if (!this.canvas) {
      this.canvas = canvas
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, null, 1, 10000)
      this.camera.position.z = 1000
      this.setSize()
    }
  }

  setSize () {
    const parentEl = this.renderer.domElement.parentElement

    this.renderer.setSize(0, 0)

    const ratio = 16 / 9
    const width = parentEl.offsetWidth
    const height = parentEl.offsetWidth / ratio

    this.renderer.setSize(width, height)

    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}

export default new World()
