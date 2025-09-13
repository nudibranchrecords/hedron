/**
 * A lo-fi starfield effect
 * @author cale-bradbury
 */

import { BufferAttribute, BufferGeometry, Group, Points, PointsMaterial, Vector3 } from 'three'

interface ParticleVert {
  position: typeof Vector3
  velocity: typeof Vector3
  colorIndex: number // 0 or 1
  colorBlendValue: number // blend value for color
}

export default class Stars {
  range = new Vector3(10000, 10000, 10000) // changed from number to Vector3
  particleCount = 1800
  root = new Group()
  particles = new BufferGeometry()
  material = new PointsMaterial({
    color: 16777215,
    size: 10,
    transparent: true,
    vertexColors: true, // enable per-vertex color
  })
  vertices: ParticleVert[] = []
  colorObjects = [new PointsMaterial().color.clone(), new PointsMaterial().color.clone()]

  particleSystem: Points
  pauseUpdates: boolean = false

  constructor() {
    this.setParticleCount(this.particleCount)
  }

  randomInRange(range: number) {
    return Math.random() * range - range / 2
  }

  vector3InRange(range: Vector3) {
    return new Vector3(
      this.randomInRange(range.x),
      this.randomInRange(range.y),
      this.randomInRange(range.z),
    )
  }

  setParticleCount(count: number) {
    this.particleCount = Math.max(0, Math.min(10000, count))
    this.vertices = []
    for (let i = 0; i < this.particleCount; i++) {
      const colorIndex = Math.random() < 0.5 ? 0 : 1
      const colorBlendValue = Math.random()
      this.vertices.push({
        position: this.vector3InRange(this.range),
        velocity: this.vector3InRange(new Vector3(1, 1, 1)),
        colorIndex,
        colorBlendValue,
      })
    }
    const positions = new Float32Array(
      this.vertices.flatMap(({ position }) => [position.x, position.y, position.z]),
    )
    const colors = new Float32Array(
      this.vertices.flatMap(({ colorIndex }) => (colorIndex === 0 ? [1, 1, 1] : [1, 0, 0])),
    )
    this.particles.setAttribute('position', new BufferAttribute(positions, 3))
    this.particles.setAttribute('color', new BufferAttribute(colors, 3))
    if (this.particleSystem) {
      this.particleSystem.geometry = this.particles
    } else {
      this.particleSystem = new Points(this.particles, this.material)
      this.root.add(this.particleSystem)
    }
  }

  update({ deltaTime, params: p }: { deltaTime: number; params: any }) {
    if (this.pauseUpdates) {
      if (p.opacity > 0) {
        this.pauseUpdates = false
      } else {
        return
      }
    }
    // Handle dynamic particle count
    if (p.particleCount !== undefined && p.particleCount !== this.particleCount) {
      this.setParticleCount(p.particleCount)
    }

    this.range.x = p.range[0] * 10000
    this.range.y = p.range[1] * 10000
    this.range.z = p.range[2] * 10000
    this.material.opacity = p.opacity
    this.particleSystem.position.z = p.depth ?? 0
    this.material.size = p.pointSize

    // Update color buffer attribute based on params
    const colorA = p.color
    const colorB = p.color2
    const blend = p.colorBlend
    const colorAttr = this.particles.attributes.color.array
    for (let i = 0; i < this.particleCount; i++) {
      let t = this.vertices[i].colorIndex
      if (blend !== 0) {
        t = Math.abs(t - this.vertices[i].colorBlendValue * blend * 0.5)
      }
      const idx = i * 3
      colorAttr[idx] = colorA[0] * (1 - t) + colorB[0] * t
      colorAttr[idx + 1] = colorA[1] * (1 - t) + colorB[1] * t
      colorAttr[idx + 2] = colorA[2] * (1 - t) + colorB[2] * t
    }
    this.particles.attributes.color.needsUpdate = true

    const positions = this.particles.attributes.position.array
    for (let i = 0; i < this.particleCount; i++) {
      const index = i * 3 // each vertex is represented by 3 values (x, y, z)
      positions[index + 2] += p.speed * deltaTime
      const velocity = this.vertices[i].velocity
      positions[index] += velocity.x * p.velocity * deltaTime
      positions[index + 1] += velocity.y * p.velocity * deltaTime
      positions[index + 2] += velocity.z * p.velocity * deltaTime

      // random walk for x/y/z
      positions[index] += this.randomInRange(p.randomWalk) * deltaTime
      positions[index + 1] += this.randomInRange(p.randomWalk) * deltaTime
      positions[index + 2] += this.randomInRange(p.randomWalk) * deltaTime

      // Only check z axis for bounds
      const z = positions[index + 2]
      const zRange = this.range.z
      if (p.speed > 0 && z > zRange / 2) {
        // If moving forward and past max z, shuffle x/y and reset z to min + extra
        positions[index] = this.randomInRange(this.range.x)
        positions[index + 1] = this.randomInRange(this.range.y)
        positions[index + 2] = -zRange / 2 - this.randomInRange(this.range.z * 0.5)
      } else if (p.speed < 0 && z < -zRange / 2) {
        // If moving backward and past min z, shuffle x/y and reset z to max + extra
        positions[index] = this.randomInRange(this.range.x)
        positions[index + 1] = this.randomInRange(this.range.y)
        positions[index + 2] = zRange / 2 + this.randomInRange(this.range.z * 0.5)
      }
    }
    this.particles.attributes.position.needsUpdate = true

    if (p.opacity === 0) {
      this.pauseUpdates = true
    }
  }

  // A basic demo of a dynamic config, note the random description
  // getConfig is called any time a sketch is loaded (initial load, or code change)
  getConfig() {
    return {
      title: 'Stars',
      description: `A simple star field - don't forget that ${
        this.sayings[Math.floor(Math.random() * this.sayings.length)]
      }`,
      category: 'simple',
      params: [
        {
          title: 'Speed',
          key: 'speed',
          defaultValue: 10000,
          sliderMin: -10000,
          sliderMax: 10000,
        },
        {
          title: 'Velocity',
          key: 'velocity',
          defaultValue: 0,
          sliderMin: 0,
          sliderMax: 10000,
        },
        {
          title: 'Random Walk',
          key: 'randomWalk',
          defaultValue: 0,
          sliderMin: 0,
          sliderMax: 10000,
        },
        {
          title: 'Range',
          key: 'range',
          defaultValue: [1, 1, 1],
          valueType: 'vector3',
        },
        {
          title: 'Particle Count',
          key: 'particleCount',
          defaultValue: 1800,
          sliderMin: 0,
          sliderMax: 10000,
        },
        {
          title: 'Depth',
          key: 'depth',
          defaultValue: 0,
          sliderMin: -10000,
          sliderMax: 0,
        },
        {
          title: 'Color',
          key: 'color',
          defaultValue: [1, 1, 1],
          valueType: 'rgb',
        },
        {
          title: 'Color 2',
          key: 'color2',
          defaultValue: [1, 1, 1],
          valueType: 'rgb',
        },
        {
          title: 'Color Blend',
          key: 'colorBlend',
          defaultValue: 0,
          sliderMin: 0,
          sliderMax: 1,
        },
        {
          title: 'Opacity',
          key: 'opacity',
          defaultValue: 1,
        },
        {
          title: 'Point Size',
          key: 'pointSize',
          defaultValue: 16,
          sliderMin: 1,
          sliderMax: 1000,
        },
      ],
      shots: [],
    }
  }

  // generated by copilot after the first string was strung <3
  sayings = [
    'you are a star',
    'you are amazing',
    'you are loved',
    'you are awesome',
    'you are special',
    'you are unique',
    'you are important',
    'you are appreciated',
    'you are valued',
    'you are cherished',
    'you are respected',
    'you are admired',
    'you are celebrated',
    'you are a gift',
    'you are a treasure',
    'you are a blessing',
    'you are a miracle',
    'you are a wonder',
    'you are a masterpiece',
    'you are a work of art',
  ]
}
