import { getType } from '../valueTypes'

export default (state, nodeId) => {
  const node = state.nodes[nodeId]
  let nodeType = node.type

  const valueType = getType(node.valueType)

  // List of options
  // exclude: remove options for those node types
  // include: ONLY allow these node types
  const options = [
    {
      value: 'audio',
      type: 'audio',
      label: 'Audio',
      exclude: ['linkableAction'],
    },
    {
      value: 'texture',
      type: 'texture',
      label: 'Texture',
      exclude: ['linkableAction'],
    },
    {
      value: 'midi-learn',
      type: 'midi',
      label: 'MIDI Learn',
    },
    {
      value: 'midi',
      type: 'midi',
      label: 'MIDI',
    },
    {
      value: 'lfo',
      type: 'lfo',
      label: 'LFO',
      exclude: ['shot', 'linkableAction'],
    },
    {
      value: 'anim',
      type: 'anim',
      label: 'Anim',
      exclude: ['linkableAction', 'shot'],
    },
    {
      value: 'seq-step',
      type: 'seq-step',
      label: 'Sequencer',
      include: ['shot'],
    },
  ]

  const filteredOptions = options.filter(opt => {
    // TODO: We might be able to remove all of the logic here and just use the valueType properties
    if (valueType) {
      return Object.keys(valueType.compatibleInputs).includes(opt.type)
    } else if (opt.include) {
      return opt.include.includes(nodeType)
    } else if (opt.exclude) {
      return !opt.exclude.includes(nodeType)
    } else {
      return true
    }
  })

  return filteredOptions
}
