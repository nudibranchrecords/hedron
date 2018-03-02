const { Object3D, MeshBasicMaterial } = require('three')
const Pipe = require('./Pipe')

class Pipes {
  constructor (blockSize, towerHeight) {
    this.pipes = []
    this.numPipes = 3
    this.group = new Object3D()
    this.group.visible = false
    this.material = new MeshBasicMaterial({ wireframe: true, color: 0x2EFFFD, fog: false })

    for (let i = 0; i < this.numPipes; i++) {
      const pipe = new Pipe(blockSize, towerHeight, this.material)
      this.pipes.push(pipe)
      this.group.add(pipe.group)
    }

    this.isRotating = false
  }

  randomPipeIndex () {
    return Math.floor(Math.random() * this.numPipes)
  }

  flicker (hide, cb) {
    const numFlicks = 5
    let i = 0
    const flick = () => {
      if (i > numFlicks) {
        this.group.visible = !hide
        if (cb) cb()
      } else {
        this.group.visible = !this.group.visible
        setTimeout(flick, Math.random() * 100)
        i++
      }
    }

    flick()
  }

  swap () {
    let randomIndex
    const r = () => {
      randomIndex = this.randomPipeIndex()
      if (randomIndex === this.visiblePipe) r()
    }
    r()
    this.visiblePipe = randomIndex
    for (let i = 0; i < this.numPipes; i++) {
      const pipe = this.pipes[i]
      if (randomIndex === i) {
        pipe.group.visible = true
      } else {
        pipe.group.visible = false
      }
    }
  }

  allOn () {
    for (let i = 0; i < this.numPipes; i++) {
      this.pipes[i].group.visible = true
    }
  }

  update (color) {
    if (this.isRotating) {
      this.group.rotation.z -= 0.015
    }

    this.material.color = color
  }
}

module.exports = Pipes
