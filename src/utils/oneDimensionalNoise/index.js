// Adapted from this nice example https://www.michaelbromley.co.uk/blog/simple-1d-noise-in-javascript/

// Must be power of 2 to work with bitwise modulo
const MAX_VERTICES = 512
const MAX_VERTICES_MASK = MAX_VERTICES - 1
const BUFFERS_COUNT = 'abcdefghijklmnopqrstuvwyxz'.length

function lerp (a, b, t) {
  return a * (1 - t) + b * t
}

class OneDimensionalNoise {
  constructor () {
    this.buffers = []

    for (let i = 0; i < BUFFERS_COUNT; ++i) {
      this.buffers[i] = []
      for (let j = 0; j < MAX_VERTICES; j++) {
        this.buffers[i].push(Math.random())
      }
    }
  }

  getValue (x, id) {
    const xFloor = Math.floor(x)
    const t = x - xFloor
    const tRemapSmoothstep = t * t * (3 - 2 * t)
    const isSeed = typeof (id) === 'number'
    const bufferId = (isSeed ? id : id.charCodeAt(0)) & BUFFERS_COUNT

    let offset = 0
    if (!isSeed) {
      for (let i = 1; i < id.length; i++) {
        offset += id.charCodeAt(i)
      }
    }

    // Modulo using &
    const xMin = (xFloor + offset) & MAX_VERTICES_MASK
    const xMax = (xMin + 1) & MAX_VERTICES_MASK

    const y = lerp(this.buffers[bufferId][xMin], this.buffers[bufferId][xMax], tRemapSmoothstep)

    return y
  }
}

export default OneDimensionalNoise
