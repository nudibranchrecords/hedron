module.exports = {
  defaultTitle: 'Cubey',
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
      key: 'scale',
      title: 'Scale',
      defaultValue: 0.5
    }
  ],
  shots: [
    {
      method: 'shapeShift'
    }
  ]
}
