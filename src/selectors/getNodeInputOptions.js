export default (state, nodeId) => {
  const node = state.nodes[nodeId]
  const options = [
    {
      value: false,
      label: 'Choose',
      disabled: true,
    },
    {
      value: 'audio',
      label: 'Audio',
    },
    {
      value: 'midi',
      type: 'midi',
      label: 'MIDI',
    },
  ]

  if (node.type !== 'shot') {
    options.push(
      {
        value: 'lfo',
        label: 'LFO',
      },
      {
        value: 'anim',
        type: 'anim',
        label: 'Anim',
      },
    )
  }

  if (node.type === 'shot') {
    options.push(
      {
        value: 'seq-step',
        label: 'Sequencer',
      }
    )
  }

  return options
}
