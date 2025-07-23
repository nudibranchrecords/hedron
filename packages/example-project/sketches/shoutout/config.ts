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
      key: 'scrollSpeed',
      title: 'Scroll Speed',
      defaultValue: 2,
      sliderMin: 0,
      sliderMax: 10,
    },
    {
      key: 'color',
      title: 'Color',
      valueType: 'rgb',
      defaultValue: [1, 1, 1],
    },
  ],
}
