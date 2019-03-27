export default (state, nodeId) => {
  const nodeType = state.nodes[nodeId].type

  // List of options
  // exclude: remove options for those node types
  // include: ONLY allow these node types
  const options = [
    {
      value: 'audio',
      label: 'Audio',
      exclude: ['linkableAction'],
    },
    {
      value: 'midi',
      type: 'midi',
      label: 'MIDI',
    },
    {
      value: 'lfo',
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
