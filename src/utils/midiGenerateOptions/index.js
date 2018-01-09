import uid from 'uid'

export default () => {
  return [
    {
      title: 'MIDI Sensitity',
      key: 'sensitity',
      id: uid(),
      value: 0.5,
      inputLinkIds: [],
      subNode: true
    }
  ]
}
