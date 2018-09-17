// Adapted from this nice example https://www.michaelbromley.co.uk/blog/simple-1d-noise-in-javascript/

// Must be power of 2 to work with bitwise modulo
const MAX_VERTICES = 512
const MAX_VERTICES_MASK = MAX_VERTICES - 1

function lerp (a, b, t) {
  return a * (1 - t) + b * t
}

class OneDimensionalNoise {
  constructor (scale) {
    this.buffer = []
    this.call = 0

    for (let i = 0; i < MAX_VERTICES; ++i) {
      this.buffer.push(Math.random())
    }
  }

  getValue (x) {
    const xFloor = Math.floor(x)
    const t = x - xFloor
    const tRemapSmoothstep = t * t * (3 - 2 * t)

    // Modulo using &
    const xMin = xFloor & MAX_VERTICES_MASK
    const xMax = (xMin + 1) & MAX_VERTICES_MASK

    const y = lerp(this.buffer[xMin], this.buffer[xMax], tRemapSmoothstep)

    return y
  }
}

export default OneDimensionalNoise
