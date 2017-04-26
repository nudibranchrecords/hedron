import uid from 'uid'

export default () => {
  return [
    {
      title: 'Shape',
      id: uid(),
      key: 'shape',
      value: 'sine'
    },
    {
      title: 'Rate',
      id: uid(),
      key: 'rate',
      value: 1
    }
  ]
}
