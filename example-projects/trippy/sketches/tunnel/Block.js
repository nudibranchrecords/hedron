const { Object3D, MeshLambertMaterial, Mesh } = require('three')
const TWEEN = require('@tweenjs/tween.js')

class Block {
  constructor (x, y, z, blockSize, colors, towerWidth, towerHeight, wavyMats, cubeGeom) {
    this.blockSize = blockSize
    this.towerHeight = towerHeight
    this.towerWidth = towerWidth
    this.wavyMatSide = false

    this.shiftTween = false

    // Tweenable properties
    this.props = {
      scale: 1,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      cubeScale: 1,
      xPos: x,
      yPos: y,
      zPos: z
    }
    this.nextProps = {}

    const wavyMatIndex = Math.floor(Math.random() * wavyMats.length)

    this.wavyMat = wavyMats[wavyMatIndex]

    this.defaultMats = [
      new MeshLambertMaterial({
        color: 0x000000
      }),
      new MeshLambertMaterial({
        color: 0x555555
      }),
      new MeshLambertMaterial({
        color: 0xffffff
      }),
      new MeshLambertMaterial({
        color: 0x222222
      }),
      new MeshLambertMaterial({
        color: 0x444444
      }),
      new MeshLambertMaterial({
        color: 0x999999
      })
    ]

    this.mats = this.defaultMats.slice(0)

    this.cube = new Mesh(cubeGeom, this.mats)
    this.group = new Object3D()
    this.group.add(this.cube)
  }

  change () {
    if (Math.random() > 0.5) {
      this.toggle()
    }
  }

  flash (boosted) {
    this.cube.material = this.defaultMats.slice(0)
    this.wavyMatSide = false

    if (boosted || Math.random() > 0.5) {
      this.wavyMatSide = Math.floor(Math.random() * 4)
      this.cube.material[this.wavyMatSide] = this.wavyMat

      if (boosted) {
        this.wavyMatSide = 'force'
        this.cube.material[Math.floor(Math.random() * 4)] = this.wavyMat
        this.cube.material[Math.floor(Math.random() * 4)] = this.wavyMat
        this.cube.material[Math.floor(Math.random() * 4)] = this.wavyMat
      }
    }
  }

  flashAllOn () {
    this.wavyMatSide = 'force'
    this.cube.material = this.wavyMat
  }

  flashAllOff () {
    this.wavyMatSide = false
    this.cube.material = this.defaultMats.slice(0)
  }

  spin () {
    const axis = ['X', 'Y', 'Z']
    const i = Math.floor(Math.random() * 3)
    const r = this.props[`rot${axis[i]}`] + Math.PI / 2

    new TWEEN.Tween(this.props)
      .to({ [`rot${axis[i]}`]: r }, this.blockSpinSpeed)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  shapeShift () {
    if (!this.visible && Math.random() > 0.7) {
      let s, c
      if (Math.random() > 0.5) {
        c = 1
        s = 0.001
      } else {
        c = 0.001
        s = 1
      }

      new TWEEN.Tween(this.props)
        .to({ cubeScale: c, sphereScale: s }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
    }
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

  toggle () {
    if (this.visible) {
      this.visible = false
    } else {
      this.visible = true
    }

    const s = this.visible ? 1 : 0.001
    const r = this.visible ? 0 : Math.PI

    new TWEEN.Tween(this.props)
      .to({ scale: s, rot: r }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  }

  move (blocks) {
    const numBlocks = this.towerWidth - 1

    let nextMove = {}
    let doTween

    let moves = {
      up: {
        prop: 'yPos',
        val: Math.round(this.props.yPos) + 1,
        enabled: true
      },
      down: {
        prop: 'yPos',
        val: Math.round(this.props.yPos) - 1,
        enabled: true
      },
      left: {
        prop: 'xPos',
        val: Math.round(this.props.xPos) + 1,
        enabled: true
      },
      right: {
        prop: 'xPos',
        val: Math.round(this.props.xPos) - 1,
        enabled: true
      },
      forward: {
        prop: 'zPos',
        val: Math.round(this.props.zPos) + 1,
        enabled: true
      },
      backward: {
        prop: 'zPos',
        val: Math.round(this.props.zPos) - 1,
        enabled: true
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      const props = blocks[i].props
      const nextProps = blocks[i].nextProps

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === this.props.yPos &&
          props.zPos === moves.forward.val ||
          moves.forward.val > this.towerHeight - 1
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === moves.forward.val
        )
      ) {
        moves.forward.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === this.props.yPos &&
          props.zPos === moves.backward.val ||
          moves.forward.val < 0
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === moves.backward.val
        )
      ) {
        moves.backward.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === moves.up.val &&
          props.zPos === this.props.zPos ||
          moves.up.val > numBlocks
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === moves.up.val &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.up.enabled = false
      }

      if (
        (
          props.xPos === this.props.xPos &&
          props.yPos === moves.down.val &&
          props.zPos === this.props.zPos ||
          moves.down.val < 0
        ) ||
        (
          nextProps.xPos === this.props.xPos &&
          nextProps.yPos === moves.down.val &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.down.enabled = false
      }

      if (
        (
          props.xPos === moves.left.val &&
          props.yPos === this.props.yPos &&
          props.zPos === this.props.zPos ||
          moves.left.val > numBlocks
        ) ||
        (
          nextProps.xPos === moves.left.val &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.left.enabled = false
      }

      if (
        (
          props.xPos === moves.right.val &&
          props.yPos === this.props.yPos &&
          props.zPos === this.props.zPos ||
          moves.right.val < 0
        ) ||
        (
          nextProps.xPos === moves.right.val &&
          nextProps.yPos === this.props.yPos &&
          nextProps.zPos === this.props.zPos
        )
      ) {
        moves.right.enabled = false
      }
    }

    if (this.props.yPos === 2) {
      if (moves.right.val === 2) moves.right.enabled = false
      if (moves.left.val === 2) moves.left.enabled = false
    }

    if (this.props.xPos === 2) {
      if (moves.up.val === 2) moves.up.enabled = false
      if (moves.down.val === 2) moves.down.enabled = false
    }

    const permittedMoves =
    Object.keys(moves).filter(key =>
      moves[key].enabled
    )

    if (permittedMoves.length) {
      const i = Math.floor(Math.random() * permittedMoves.length)
      const move = moves[permittedMoves[i]]
      nextMove = { [move.prop]: move.val }
      doTween = true
    }

    this.nextProps = Object.assign({}, this.props, nextMove)

    if (doTween) {
      if (this.shiftTween) {
        this.shiftTween.stop()
      }
      this.shiftTween = new TWEEN.Tween(this.props)
        .to(nextMove, this.blockShiftSpeed)
        .easing(TWEEN.Easing.Bounce.Out)
        .start()
    }
  }

  update (p, t, f, color) {
    const blockSize = this.blockSize
    const towerHeight = this.towerHeight

    const { blockShiftSpeed, blockSpinSpeed } = p

    this.blockShiftSpeed = 1000 - (1000 * blockShiftSpeed)
    this.blockSpinSpeed = 1000 - (1000 * blockSpinSpeed)

    this.group.rotation.x = this.props.rotX
    this.group.rotation.y = this.props.rotY
    this.group.rotation.z = this.props.rotZ

    this.group.position.x = this.props.xPos * blockSize - blockSize * 2
    this.group.position.y = this.props.yPos * blockSize - blockSize * 2
    this.group.position.z = this.props.zPos * blockSize - blockSize * towerHeight / 2
  }
}

module.exports = Block
