const { Object3D, ShaderMaterial, Color, BoxBufferGeometry, UniformsUtils, UniformsLib } = require('three')
const Block = require('./Block')
const Pipes = require('./Pipes')
const glsl = require('glslify')
const vertShader = glsl.file('./vert.glsl')
const fragShader = glsl.file('./frag.glsl')

class Tower {
  constructor (blockSize, colors, towerWidth, towerHeight, startPos) {
    const now = Date.now()
    this.pipes = new Pipes(blockSize, towerHeight)
    const numWavyMats = 5
    this.delta = now
    this.gamma = now
    this.beta = now
    this.alpha = now + 500
    this.blocks = []
    this.group = new Object3D()
    this.group.position.z = startPos
    this.maxZ = towerHeight * blockSize
    this.minZ = -this.maxZ
    this.tower = new Object3D()
    this.group.add(this.tower)
    this.group.add(this.pipes.group)
    this.isFlickering = false

    this.props = {
      perlinTime: 0
    }

    this.wavyMats = []

    for (let i = 0; i < numWavyMats; i++) {
      const uniforms = UniformsUtils.merge([
        UniformsLib[ 'fog' ],
        {
          iTime: { value: Date.now(), type: 'f' },
          seed: { value: Math.random() * 100 },
          color1: { value: new Color(colors[0]) },
          color2: { value: new Color(0x2EFFFD) }
        }
      ])
      const mat = new ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        fog: false,
        uniforms
      })

      this.wavyMats.push(mat)
    }

    const cubeGeom = new BoxBufferGeometry(blockSize, blockSize, blockSize)

    for (let x = 0; x < towerWidth; x++) {
      for (let y = 0; y < towerWidth; y++) {
        for (let z = 0; z < towerHeight - 2; z++) {
          if (!(x === 2 && y === 2) && Math.random() > 0.5) {
            const newBlock = new Block(
              x, y, z, blockSize, colors, towerWidth, towerHeight, this.wavyMats, cubeGeom
            )
            this.tower.add(newBlock.group)
            this.blocks.push(newBlock)
          }
        }
      }
    }

    this.flashBlocks()
  }

  removeBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() > 0.8) {
        this.blocks[i].flicker(true)
      }
    }
  }

  addBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() > 0.8) {
        this.blocks[i].flicker()
      }
    }
  }

  shiftBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].move(this.blocks)
    }
  }

  spinBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() > 0.5) {
        this.blocks[i].spin()
      }
    }
  }

  flashBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].flash()
    }
  }

  flashAllBlocksOn () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].flashAllOn()
    }
  }

  flashAllBlocksOff () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].flashAllOff()
    }
  }

  boostedFlashBlocks () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].flash(true)
    }
  }

  pipesOn () {
    this.pipes.flicker()
  }

  pipesOff () {
    this.pipes.flicker(true)
  }

  pipesSwap () {
    this.pipes.group.visible = true
    this.pipes.swap()
  }

  pipesAllOn () {
    this.pipes.flicker()
    this.pipes.allOn()
  }

  flicker (cb) {
    const numFlicks = 5
    let i = 0
    const flick = () => {
      if (i > numFlicks) {
        this.group.visible = true
        cb()
      } else {
        this.group.visible = !this.group.visible
        setTimeout(flick, Math.random() * 50)
        i++
      }
    }

    flick()
  }

  update (p, t, f, color) {
    const blocks = this.blocks
    let { tunnelScale, zSpeed, perlinSpeed } = p
    const speed = ((zSpeed * 2) - 1) * f * 20
    const scale = 1 + (10 * tunnelScale)

    this.props.perlinTime += perlinSpeed * f / 10

    this.group.position.z += speed

    if (this.group.position.z < this.minZ && !this.isFlickering) {
      this.isFlickering = true
      this.flicker(() => {
        this.isFlickering = false
        const diff = Math.abs(this.group.position.z) - Math.abs(this.minZ)
        this.group.position.z = this.maxZ - diff
      })
    } else if (this.group.position.z > this.maxZ && !this.isFlickering) {
      const diff = this.group.position.z - this.maxZ
      this.group.position.z = this.minZ + diff
    }

    this.tower.scale.set(scale, scale, 1)

    this.pipes.update(color)

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update(p, t, f, color)
    }

    for (let i = 0; i < this.wavyMats.length; i++) {
      this.wavyMats[i].uniforms.iTime.value = this.props.perlinTime
      this.wavyMats[i].uniforms.color2.value = color
    }
  }
}

module.exports = Tower
