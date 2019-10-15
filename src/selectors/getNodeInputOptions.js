export default (state, nodeId) => {
  const node = state.nodes[nodeId]
  let nodeType = node.type

  if (nodeType === 'param') {
    nodeType += `-${node.valueType}`
  }

  // List of options
  // exclude: remove options for those node types
  // include: ONLY allow these node types
  const options = [
    {
      value: 'audio',
      label: 'Audio',
      exclude: ['linkableAction', 'param-boolean'],
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
      label: 'LFO',
      exclude: ['shot', 'linkableAction', 'param-boolean'],
    },
    {
      value: 'anim',
      type: 'anim',
      label: 'Anim',
      exclude: ['linkableAction', 'shot', 'param-boolean'],
    },
    {
      value: 'seq-step',
      label: 'Sequencer',
      include: ['shot'],
    },
  ]

  const filteredOptions = options.filter(opt => {
    if (opt.include) {
      return opt.include.includes(nodeType)
    } else if (opt.exclude) {
      return !opt.exclude.includes(nodeType)
    } else {
      return true
    }
  })

  return filteredOptions
}
