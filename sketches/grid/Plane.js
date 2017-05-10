const THREE = require('three')

class Plane {

  constructor () {
    const size = 1000
    const step = 20

    const material = new THREE.LineBasicMaterial({ transparent: true })
    const geometry = new THREE.Geometry()

    for (let i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i))
      geometry.vertices.push(new THREE.Vector3(size, 0, i))

      geometry.vertices.push(new THREE.Vector3(i, 0, -size))
      geometry.vertices.push(new THREE.Vector3(i, 0, size))
    }

    this.mesh = new THREE.Line(geometry, material, THREE.LinePieces)
  }

  update (params) {
    this.mesh.position.z += (params.speed - 0.5) * 15

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
