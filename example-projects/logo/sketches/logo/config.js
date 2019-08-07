module.exports = {
  defaultTitle: 'Hedron Logo',
  params: [
    {
      key: 'colorH',
      title: 'Color H',
      defaultValue: 0.5,
    },
    {
      key: 'colorS',
      title: 'Color S',
      defaultValue: 0.5,
    },
    {
      key: 'colorL',
      title: 'Color L',
      defaultValue: 0.5,
    },
    {
      key: 'aInt',
      title: 'Ambient Light Intensity',
      defaultValue: 0.1,
    },
    {
      key: 'pInt',
      title: 'Point Light Intensity',
      defaultValue: 0.5,
      defaultMin: 0,
      defaultMax: 5,
    },
    {
      key: 'logoRotSpeedX',
      title: 'Logo Rot Speed X',
      defaultValue: 0,
    },
    {
      key: 'logoRotSpeedY',
      title: 'Logo Rot Speed Y',
      defaultValue: 0,
    },
    {
      key: 'logoRotSpeedZ',
      title: 'Logo Rot Speed Z',
      defaultValue: 0,
    },
    {
      key: 'logoScale',
      title: 'Logo Scale',
      defaultValue: 0.7,
    },
    {
      key: 'sphereScale',
      title: 'Sphere Scale',
      defaultValue: 1,
    },
  ],
  shots: [
    {
      method: 'resetLogoRot',
      title: 'Reset Logo Rot',
    },
  ],
}

