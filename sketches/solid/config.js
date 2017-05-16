module.exports = {
  defaultTitle: 'Solid',
  params: [
    {
      key: 'rotX',
      title: 'Rotation X',
      defaultValue: 0
    },
    {
      key: 'rotY',
      title: 'Rotation Y',
      defaultValue: 0
    },
    {
      key: 'rotZ',
      title: 'Rotation Z',
      defaultValue: 0
    },
    {
      key: 'scale',
      title: 'Scale',
      defaultValue: 0.5
    },
    {
      key: 'faceOpacity',
      title: 'Face Opacity',
      defaultValue: 1
    },
    {
      key: 'wireframeOpacity',
      title: 'Wireframe Opacity',
      defaultValue: 0
    }
  ],
  shots: [
    {
      method: 'shapeShift',
      title: 'Shape Shift'
    }
  ]
}
