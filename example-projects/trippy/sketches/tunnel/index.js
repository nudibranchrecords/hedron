const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Tower = require('./Tower')

class Tunnel {
  constructor (world) {
    world.scene.fog = new THREE.FogExp2()
    this.root = new THREE.Group()
    const groupSize = 500
    const towerHeight = 10
    const towerWidth = 5
    const blockSize = groupSize / towerWidth

    this.isRotating = false
    this.colors = [0x004C48, 0x962515]

    this.rotator = new THREE.Object3D()
    this.rotator.position.z = 1000
    this.root.add(this.rotator)

    this.tower1 = new Tower(blockSize, this.colors, towerWidth, towerHeight, -towerHeight * blockSize / 2)
    this.tower2 = new Tower(blockSize, this.colors, towerWidth, towerHeight, towerHeight * blockSize / 2)
    this.rotator.add(this.tower1.group)
    this.rotator.add(this.tower2.group)

    this.rotatorProps = {
      rotZ: 0
    }
  }

  quarterTurn () {
    let diff = Math.round(this.rotatorProps.rotZ % (Math.PI / 4) * 1000) / 1000

    new TWEEN.Tween(this.rotatorProps)
      .to({ rotZ: this.rotatorProps.rotZ + ((Math.PI / 4) - diff) }, this.rotTweenSpeed)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  removeBlocks () {
    this.tower1.removeBlocks()
    this.tower2.removeBlocks()
  }

  addBlocks () {
    this.tower1.addBlocks()
    this.tower2.addBlocks()
  }

  shiftBlocks () {
    this.tower1.shiftBlocks()
    this.tower2.shiftBlocks()
  }

  spinBlocks () {
    this.tower1.spinBlocks()
    this.tower2.spinBlocks()
  }

  flashBlocks () {
    this.tower1.flashBlocks()
    this.tower2.flashBlocks()
  }

  flashAllBlocksOn () {
    this.tower1.flashAllBlocksOn()
    this.tower2.flashAllBlocksOn()
  }

  flashAllBlocksOff () {
    this.tower1.flashAllBlocksOff()
    this.tower2.flashAllBlocksOff()
  }

  boostedFlashBlocks () {
    this.tower1.boostedFlashBlocks()
    this.tower2.boostedFlashBlocks()
  }

  pipesOn () {
    this.tower1.pipesOn()
    this.tower2.pipesOn()
  }

  pipesOff () {
    this.tower1.pipesOff()
    this.tower2.pipesOff()
  }

  pipesSwap () {
    this.tower1.pipesSwap()
    this.tower2.pipesSwap()
  }

  pipesAllOn () {
    this.tower1.pipesAllOn()
    this.tower2.pipesAllOn()
  }

  update (p, t, f) {
    const { rotSpeed, rotTweenSpeed, colorH, colorS, colorL } = p
    const color = new THREE.Color().setHSL(colorH, colorS, colorL)
    this.tower1.update(p, t, f, color)
    this.tower2.update(p, t, f, color)

    this.rotTweenSpeed = 1000 - (rotTweenSpeed * 1000)

    this.rotatorProps.rotZ += rotSpeed * 0.5

    this.rotator.rotation.z = this.rotatorProps.rotZ
    this.rotator.scale.set(25, 25, 25)

    TWEEN.update()
  }
}

module.exports = Tunnel
