const THREE = require('three')
const Sketch = require('../../src/Engine/Sketch.js')

class Solid extends Sketch {

  constructor () {
    super()
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const size = 800

    const geoms = [
      new THREE.BoxGeometry(size, size, size),
      new THREE.OctahedronGeometry(size),
      new THREE.TetrahedronGeometry(size),
      new THREE.DodecahedronGeometry(size),
      new THREE.IcosahedronGeometry(size)
    ]

    this.meshes = []

    this.group = new THREE.Object3D()
    this.group.position.z = 500

    geoms.forEach(geom => {
      const mesh = new THREE.Mesh(geom, material)
      this.meshes.push(mesh)
      this.group.add(mesh)
    })

    this.currentMeshIndex = 0

    this.root.add(this.group)

    this.shapeShift()
  }

  shapeShift () {
    if (this.currentMeshIndex > this.meshes.length - 1) this.currentMeshIndex = 0

    this.meshes.forEach((mesh, index) => {
      if (this.currentMeshIndex !== index) {
        mesh.visible = false
      } else {
        mesh.visible = true
      }
    })

    this.currentMeshIndex ++
  }

  update (params) {
    this.group.rotation.x += params.rotX * 0.15
    this.group.rotation.y += params.rotY * 0.15
    this.group.rotation.z += params.rotZ * 0.15

    if (params.scale === 0) params.scale = 0.00001

    this.group.scale.set(params.scale, params.scale, params.scale)
  }
}

module.exports = Solid
