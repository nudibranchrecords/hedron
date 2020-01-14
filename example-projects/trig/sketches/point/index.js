const { THREE } = window.HEDRON.dependencies

class Point {
  constructor () {
    this.root = new THREE.Group()
    const geom = new THREE.IcosahedronGeometry(0.5)
    const mat = new THREE.MeshNormalMaterial()
    this.mesh = new THREE.Mesh(geom, mat)

    this.root.add(this.mesh)
  }

  update ({ params }) {
    const rad = 5

    this.mesh.position.x = (rad * params.posX) - rad / 2
    this.mesh.position.y = (rad * params.posY) - rad / 2
    this.mesh.position.z = (rad * params.posZ) - rad / 2
  }
}

module.exports = Point
