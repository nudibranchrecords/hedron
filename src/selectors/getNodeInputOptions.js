export default (state, nodeId) => {
  const node = state.nodes[nodeId]
  const options = [
    {
      value: false,
      label: 'Choose',
      disabled: true,
    },
    {
      value: 'audio_0',
      type: 'audio',
      label: 'Low',
    },
    {
      value: 'audio_1',
      type: 'audio',
      label: 'Low-Mid',
    },
    {
      value: 'audio_2',
      type: 'audio',
      label: 'Mid',
    },
    {
      value: 'audio_3',
      type: 'audio',
      label: 'High',
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
      }
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
