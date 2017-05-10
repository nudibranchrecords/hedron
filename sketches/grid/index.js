const THREE = require('three')
const Sketch = require('../../src/Engine/Sketch.js')
const Plane = require('./Plane')
const PI2 = Math.PI * 2

class Grid extends Sketch {

  constructor () {
    super()

    this.topGrid = new Plane()
    this.bottomGrid = new Plane()

    this.group = new THREE.Object3D()
    this.group.add(this.topGrid.mesh)
    this.group.add(this.bottomGrid.mesh)

    this.group2 = new THREE.Object3D()
    this.group2.add(this.group)

    this.root.add(this.group2)

    // Define base rotation
    this.rotZ = 0
    this.rotY = 0
  }

  update (params) {
    // Reset base rotation if param has changed
    if (this.rotY !== params.rotY) {
      this.rotY = params.rotY
      this.group.rotation.y = this.rotY * PI2
    }

    if (this.rotZ !== params.rotZ) {
      this.rotZ = params.rotZ
      this.group2.rotation.z = this.rotZ * PI2
    }

    this.group.rotation.y += params.rotSpeedY * 0.1
    this.group2.rotation.z += params.rotSpeedZ * 0.1

    this.topGrid.mesh.position.y = params.gutter * 300
    this.bottomGrid.mesh.position.y = -params.gutter * 300

    this.topGrid.update(params)
    this.bottomGrid.update(params)
  }
}

module.exports = Grid

