import OneDimensionalNoise from '../oneDimensionalNoise'
const Noise = new OneDimensionalNoise()
const PI2 = Math.PI * 2

export default (delta, shape, rate, phase, id) => {
  const x = delta * rate + phase
  let y

  switch (shape) {
    case 'sine':
      y = Math.sin(x * PI2) * 0.5 + 0.5
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
      y = Noise.getValue(x, id)
      break
  }

  return y
}
