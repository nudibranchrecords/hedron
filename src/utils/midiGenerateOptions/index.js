import uid from 'uid'

export default () => {
  return [
    {
      title: 'MIDI Sensitivity',
      key: 'sensitivity',
      id: uid(),
      value: 0.5,
      inputLinkIds: [],
      subNode: true,
    },
    {
      title: 'Control Type',
      key: 'controlType',
      type: 'select',
      id: uid(),
      value: 'abs',
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 'abs',
          label: 'Absolute',
        },
        {
          value: 'rel1',
          label: 'Relative 1',
        },
        {
          value: 'rel2',
          label: 'Relative 2',
        },
        {
          value: 'rel3',
          label: 'Relative 3',
        },
      ],
    },
  ]
}
