/** HEDRON TIP **
  Look in "example-projects/simple/sketches/solid" for info on how to create sketches
**/
const THREE = require('three')

const range = 10000
const particleCount = 1800

const randomInRange = () =>
  Math.random() * range - range / 2

class Stars {
  constructor () {
    this.root = new THREE.Group()
    // create the particle variables
    this.particles = new THREE.Geometry()
    this.material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 10,
      transparent: true
    })

    // now create the individual particles
    for (let p = 0; p < particleCount; p++) {
      // create a particle with random position
      const pX = randomInRange()
      const pY = randomInRange()
      const pZ = randomInRange()

      const particle = new THREE.Vector3(pX, pY, pZ)

      particle.velocity = new THREE.Vector3(0, 0, -100)
      this.particles.vertices.push(particle)
    }

    // create the particle system
    this.particleSystem = new THREE.Points(
    this.particles,
    this.material
  )

    // add it to the scene
    this.root.add(this.particleSystem)
  }

  update (params, time, frameDiff, allParams) {
    const p = params
    let pCount = particleCount

    this.material.opacity = p.opacity

    if (p.opacity) {
      while (pCount--) {
        // get the particle
        const particle = this.particles.vertices[pCount]

        if (particle.z < -range / 2) {
          particle.z = range / 2
        }

        if (particle.z > range / 2) {
          particle.z = -range / 2
        }

        // and the position
        particle.z += particle.velocity.z * p.speed

        // flag to the particle system
        // that we've changed its vertices.
        this.particleSystem.geometry.verticesNeedUpdate = true
      }
    }
  }
}

module.exports = Stars
