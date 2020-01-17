const { THREE } = window.HEDRON.dependencies
const range = 10000
const particleCount = 1800

const randomInRange = () =>
  Math.random() * range - range / 2

class Stars {
  constructor () {
    this.root = new THREE.Group()
    this.particles = new THREE.Geometry()
    this.material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 10,
      transparent: true,
    })

    // Create some random positions for particles
    for (let p = 0; p < particleCount; p++) {
      const pX = randomInRange()
      const pY = randomInRange()
      const pZ = randomInRange()

      const particle = new THREE.Vector3(pX, pY, pZ)

      particle.velocity = new THREE.Vector3(0, 0, -100)
      this.particles.vertices.push(particle)
    }

    // create the particle system and add to the sketch root
    this.particleSystem = new THREE.Points(
      this.particles,
      this.material
    )
    this.root.add(this.particleSystem)
  }

  update ({ params: p }) {
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
