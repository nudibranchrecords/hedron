/** HEDRON TIP **
  Look in "example-projects/simple/sketches/solid" for info on how to create sketches
**/
const THREE = require('three')
const videoTexture = require('./videoTexture')

class CamCubes {
  constructor () {
    this.root = new THREE.Group()
    this.group = new THREE.Group()
    this.root.add(this.group)

    videoTexture.on('got-feed', (texture) => {
      this.mat = new THREE.MeshLambertMaterial({
        map: texture
      })

      this.geom = new THREE.BoxGeometry(500, 500, 500)
      this.mesh = new THREE.Mesh(this.geom, this.mat)
      this.group.add(this.mesh)
    })
  }

  update (params, time, frameDiff, allParams) {
    this.group.rotation.x += 0.01
    this.group.rotation.y += 0.01
  }
}

module.exports = CamCubes
