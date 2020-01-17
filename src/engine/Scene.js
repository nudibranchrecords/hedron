const { THREE } = window.HEDRON.dependencies

class Scene {
  constructor () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, null, 1, 100000)
    this.camera.position.z = 5
  }

  setRatio (ratio) {
    this.camera.aspect = ratio
    this.camera.updateProjectionMatrix()
  }
}

export default Scene
