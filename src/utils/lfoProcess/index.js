export default (delta, shape, rate) => {
  let x = delta * rate
  let y

  switch (shape) {
    case 'sine':
      y = Math.sin(x)
      break
    case 'sawTooth':
      y = (x - Math.floor(x + 0.5)) * 2
      break
    case 'rSawTooth':
      y = -(x - Math.floor(x + 0.5)) * 2
      break
    case 'square':
      y = Math.sign(Math.sin(x))
      break
    case 'triangle':
      y = Math.abs((x - Math.floor(x + 0.5)) * 2)
      break
  }

  return (y + 1) / 2 // convert from -1 ~ 1 to 0 ~ 1
}
