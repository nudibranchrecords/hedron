module.exports = {
  defaultTitle: 'Text Basic',
  params: [
    {
      key: 'posX',
      defaultValue: 0.5,
      defaultMin: -10,
      defaultMax: 10,
    },
    {
      key: 'posY',
      defaultValue: 0.5,
      defaultMin: -10,
      defaultMax: 10,
    },
    {
      key: 'posZ',
      defaultValue: 0.5,
      defaultMin: -20,
      defaultMax: 0,
    },

    {
      key: 'rotX',
      defaultValue: 0.5,
      defaultMin: -3.1415,
      defaultMax: 3.1415,
    },
    {
      key: 'rotY',
      defaultValue: 0.5,
      defaultMin: -3.1415,
      defaultMax: 3.1415,
    },
    {
      key: 'rotZ',
      defaultValue: 0.5,
      defaultMin: -3.1415,
      defaultMax: 3.1415,
    },
    {
      key: 'colorHue',
      defaultValue: 0.6,
    },
    {
      key: 'colorSat',
      defaultValue: 0.5,
    },
    {
      key: 'colorLight',
      defaultValue: 0.5,
    },
    {
      key: 'alpha',
      defaultValue: 1,
    },
    {
      key: 'scale',
      defaultValue: 0.5,
      defaultMin: 0.00001,
      defaultMax: 10,
    },
    {
      key: 'thickness',
      defaultValue: 0.4,
      defaultMin: 0.0001,
      defaultMax: 1,
    },
    {
      key: 'text',
      defaultValue: ':)',
      valueType: 'string',
    },
  ],
}
