const { TubeGeometry, Mesh, Vector3, CubicBezierCurve3, Geometry } = require('three')
const _ = require('lodash')

class Pipe {
  constructor (blockSize, towerHeight, material) {
    const boundry = [2, 2]

    // const cubeGeom = new BoxGeometry(blockSize, blockSize, blockSize)
    // const cubeMaterial = new MeshBasicMaterial({ wireframe: true })
    // const blockHelper = new Mesh(cubeGeom, cubeMaterial)
    this.geom = new Geometry()

    const createBend = (prevDir, nextDir) => {
      const bendCurve = new CubicBezierCurve3(
        new Vector3(-prevDir[0] * blockSize / 2, -prevDir[1] * blockSize / 2, -prevDir[2] * blockSize / 2),
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0),
        new Vector3(nextDir[0] * blockSize / 2, nextDir[1] * blockSize / 2, nextDir[2] * blockSize / 2)
      )
      const bendGeom = new TubeGeometry(bendCurve, 10, 10, 8, false)
      // bend.add(blockHelper.clone())
      return bendGeom
    }

    const positions = []
    let nextPos = [1, 0, 0]
    let failCount = 0
    const failLimit = 50
    let z = 0
    let i = 0
    while (z > -towerHeight && failCount < failLimit) {
      const calc = () => {
        let rp
        if (Math.random() > 0.5) {
          // Encourage twisty pipes by only allowing
          // them to go forwards 50% of the time
          rp = Math.floor(Math.random() * 3)
        } else {
          rp = Math.floor(Math.random() * 2)
        }
        if (rp === 2) {
          z--
        }
        const r = rp === 2 ? -1 : Math.random() > 0.5 ? 1 : -1
        const dir = [0, 0, 0]
        dir[rp] = r

        nextPos = [pos[0] + dir[0], pos[1] + dir[1], pos[2] + dir[2]]
        let allowNextPos = true

        if (nextPos[0] > boundry[0] || nextPos[0] < -boundry[0] ||
          nextPos[1] > boundry[1] || nextPos[1] < -boundry[1] ||
          (nextPos[0] === 0 && nextPos[1] === 0)
        ) {
          allowNextPos = false
        } else {
          for (let j = 0; j < i; j++) {
            const p = positions[j]
            if (_.isEqual(nextPos, p.pos)) {
              allowNextPos = false
            }
          }
        }

        if (allowNextPos) {
          failCount = 0
          positions[i] = { dir, pos }
          i++
        } else if (failCount < failLimit) {
          failCount++
          calc()
        }
      }
      const pos = nextPos

      calc()
    }

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i].pos
      const d = positions[i].dir
      const prevDir = i > 0 ? positions[i - 1].dir : [1, 0, 0]

      const s = createBend(prevDir, d)
      s.translate(p[0] * blockSize, p[1] * blockSize, p[2] * blockSize)

      this.geom.merge(s)
    }

    this.group = new Mesh(this.geom, material)
  }
}

module.exports = Pipe
