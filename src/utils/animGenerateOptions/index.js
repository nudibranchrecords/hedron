import uid from 'uid'
import { getType } from '../../valueTypes'

// Generate all tween.js options for easing funcs
const easeCurves = [
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

const curveOptions = [
  {
    value: 'Linear.None',
    label: 'Linear',
  },
]

easeCurves.forEach(curve => {
  modes.forEach(mode => {
    const val = `${curve}.${mode}`
    curveOptions.push({
      value: val,
      label: val,
    })
  })
})

export default (nodeValueType) => {
  // Get node valueType related options
  const extraOptions = getType(nodeValueType).getExtraInputOptions('anim')

  return [
    {
      title: 'Target Val',
      id: uid(),
      key: 'targetVal',
      valueType: 'float',
      value: 1,
      inputLinkIds: [],
      subNode: true,
    },
    {
      title: 'Curve',
      id: uid(),
      key: 'curve',
      value: 'Linear.None',
      valueType: 'enum',
      inputLinkIds: [],
      subNode: true,
      options: curveOptions,
    },
    {
      title: 'Duration',
      id: uid(),
      valueType: 'float',
      key: 'duration',
      value: 0,
      inputLinkIds: [],
      subNode: true,
    },
    ...extraOptions,
  ]
}
