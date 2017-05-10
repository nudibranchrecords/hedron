const THREE = require('three')

class Plane {

  constructor () {
    const size = 3000
    const step = 50

    this.material = new THREE.LineBasicMaterial({ transparent: true })
    const geometry = new THREE.Geometry()

    for (let i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i))
      geometry.vertices.push(new THREE.Vector3(size, 0, i))

      geometry.vertices.push(new THREE.Vector3(i, 0, -size))
      geometry.vertices.push(new THREE.Vector3(i, 0, size))
    }

    this.mesh = new THREE.Line(geometry, this.material, THREE.LinePieces)
    // Ensures it is rendered last to prevent transparency issues
    this.mesh.renderOrder = -1
  }

  update (params) {
    this.mesh.position.z += (params.speed - 0.5) * 15
    this.material.opacity = params.opacity

    if (this.mesh.position.z > 100) {
      const remainder = this.mesh.position.z % 100
      this.mesh.position.z = remainder
    }

    if (this.mesh.position.z < -100) {
      const remainder = this.mesh.position.z % -100
      this.mesh.position.z = remainder
    }
  }

}

module.exports = Plane
