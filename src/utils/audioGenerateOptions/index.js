import uid from 'uid'

export default () => {
  return [
    {
      title: 'Audio Band',
      key: 'audioBand',
      type: 'select',
      id: uid(),
      value: 0,
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 0,
          label: 'Low',
        },
        {
          value: 1,
          label: 'Low-Mid',
        },
        {
          value: 2,
          label: 'Mid',
        },
        {
          value: 3,
          label: 'High',
        },
      ],
    },
  ]
}
