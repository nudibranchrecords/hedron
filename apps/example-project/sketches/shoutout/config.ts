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
      valueType: 'vector2',
      defaultValue: [0, 0],
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
  shots: [
    {
      key: 'shuffle',
      title: 'Shuffle',
    },
    {
      key: 'displayMidiNote',
      title: 'Display MIDI Note',
    },
    {
      key: 'resetScroll',
      title: 'Reset Scroll',
    },
  ],
}
