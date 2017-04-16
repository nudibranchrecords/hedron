const THREE = require('three')
const Sketch = require('../../src/Engine/Sketch.js')

class Cubey extends Sketch {

  constructor () {
    super()
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const geoms = [
      new THREE.BoxGeometry(800, 800, 800),
      new THREE.OctahedronGeometry(800),
      new THREE.TetrahedronGeometry(800),
      new THREE.DodecahedronGeometry(800),
      new THREE.IcosahedronGeometry(800)
    ]

    this.meshes = []

    this.group = new THREE.Object3D()

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
    this.group.rotation.x += params.rotX
    this.group.rotation.y += params.rotY
    this.group.scale.set(params.scale, params.scale, params.scale)
  }
}

module.exports = Cubey
