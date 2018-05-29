import OneDimensionalNoise from '../oneDimensionalNoise'
const Noise = new OneDimensionalNoise()

export default (delta, shape, rate) => {
  let x = delta * rate
  let y

  switch (shape) {
    case 'sine':
      y = Math.cos(x * 6.28318530718) * 0.5 + 0.5
      break
    case 'sawtooth':
      y = x % 1
      break
    case 'rSawtooth':
      y = 1 - (x % 1)
      break
    case 'square':
      y = Math.floor((x % 1) * 2)
      break
    case 'triangle':
      y = Math.abs((x % 1) * 2 - 1)
      break
    case 'noise':
      y = Noise.getValue(x)
      break
  }

  return y
}
