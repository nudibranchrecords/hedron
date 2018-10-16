const THREE = require('three')

class Point {

  constructor () {
    this.root = new THREE.Group()
    const geom = new THREE.IcosahedronGeometry(100)
    const mat = new THREE.MeshNormalMaterial()
    this.mesh = new THREE.Mesh(geom, mat)

    this.root.add(this.mesh)
  }

  update (params, time, frameDiff, allParams) {
    const rad = 1500

    this.mesh.position.x = (rad * params.posX) - rad / 2
    this.mesh.position.y = (rad * params.posY) - rad / 2
    this.mesh.position.z = (rad * params.posZ) - rad / 2
  }

}

module.exports = Point
