const THREE = require('three')
const Sketch = require('../../src/Engine/Sketch.js')

class Solid extends Sketch {

  constructor () {
    super()
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true
    })

    this.facesMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true
    })

    this.facesMaterial.shading = THREE.FlatShading

    var ambientLight = new THREE.AmbientLight(0x000000)
    this.root.add(ambientLight)

    var lights = []
    lights[ 0 ] = new THREE.PointLight(0xffffff, 1, 0)
    lights[ 1 ] = new THREE.PointLight(0xffffff, 1, 0)
    lights[ 2 ] = new THREE.PointLight(0xffffff, 1, 0)

    lights[ 0 ].position.set(0, 1000, 0)
    lights[ 1 ].position.set(2000, 1000, 1000)
    lights[ 2 ].position.set(-1000, -2000, -1000)

    this.root.add(lights[ 0 ])
    this.root.add(lights[ 1 ])
    this.root.add(lights[ 2 ])

    const size = 300

    const geoms = [
      new THREE.IcosahedronGeometry(size),
      new THREE.BoxGeometry(size, size, size),
      new THREE.OctahedronGeometry(size),
      new THREE.TetrahedronGeometry(size),
      new THREE.DodecahedronGeometry(size)
    ]

    this.meshes = []

    this.group = new THREE.Object3D()
    this.group.position.z = 500

    geoms.forEach(geom => {
      const group = new THREE.Object3D()
      const mesh1 = new THREE.Mesh(geom, this.wireframeMaterial)
      const mesh2 = new THREE.Mesh(geom, this.facesMaterial)
      group.add(mesh1)
      group.add(mesh2)
      this.meshes.push(group)
      this.group.add(group)
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
    this.wireframeMaterial.opacity = params.wireframeOpacity
    this.facesMaterial.opacity = params.faceOpacity

    if (params.scale === 0) params.scale = 0.00001

    this.group.scale.set(params.scale, params.scale, params.scale)
  }
}

module.exports = Solid
