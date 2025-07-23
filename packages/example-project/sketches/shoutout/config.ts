export default {
  title: 'Shoutout',
  description: 'Text message!',
  params: [
    {
      key: 'message',
      title: 'Message',
      valueType: 'string',
      defaultValue: 'Hello, world!',
    },
    {
      key: 'position',
      title: 'Position',
      valueType: 'vector3',
      defaultValue: [0, 0, 0],
    },
  ],
}
