module.exports = {
  defaultTitle: 'Hedron Logo',
  params: [
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

