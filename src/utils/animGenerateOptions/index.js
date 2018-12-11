import uid from 'uid'

// Generate all tween.js options for easing funcs
const curves = [
  'Linear',
  'Quadratic',
  'Cubic',
  'Quartic',
  'Quintic',
  'Sinusoidal',
  'Exponential',
  'Circular',
  'Elastic',
  'Back',
  'Bounce',
]

const modes = [ 'In', 'Out', 'InOut' ]

const curveOptions = []

curves.forEach(curve => {
  modes.forEach(mode => {
    const val = `${curve}.${mode}`
    curveOptions.push({
      value: val,
      label: val,
    })
  })
})

export default () => {
  return [
    {
      title: 'Target Val',
      id: uid(),
      key: 'targetVal',
      value: 1,
      inputLinkIds: [],
      subNode: true,
    },
    {
      title: 'Curve',
      id: uid(),
      key: 'curve',
      value: 'sine',
      type: 'select',
      inputLinkIds: [],
      subNode: true,
      options: curveOptions,
    },
    {
      title: 'Duration',
      id: uid(),
      key: 'duration',
      value: 0,
      inputLinkIds: [],
      subNode: true,
    },
  ]
}
