module.exports = {
  defaultTitle: 'Env',
  params: [
    {
      key: 'fogDensity',
      title: 'Fog Density',
      defaultValue: 0
    },
    {
      key: 'colorH',
      title: 'BG Color H',
      defaultValue: 0
    },
    {
      key: 'colorS',
      title: 'BG Color S',
      defaultValue: 0
    },
    {
      key: 'colorL',
      title: 'BG Color L',
      defaultValue: 0
    },
    {
      key: 'mainLightIntensity',
      title: 'Main Light Intensity',
      defaultValue: 1
    },
    {
      key: 'centralPointLightDistance',
      title: 'Central Point Light Distance',
      defaultValue: 0.5
    },
    {
      key: 'centralPointLightIntensity',
      title: 'Central Point Light Intensity',
      defaultValue: 0.5
    },
    {
      key: 'centralPointLightH',
      title: 'Central Point Light Color H',
      defaultValue: 1
    },
    {
      key: 'centralPointLightS',
      title: 'Central Point Light Color S',
      defaultValue: 1
    },
    {
      key: 'centralPointLightL',
      title: 'Central Point Light Color L',
      defaultValue: 1
    }
  ],
  shots: [
    {
      title: 'Camera 1',
      method: 'camera1'
    },
    {
      title: 'Camera 2',
      method: 'camera2'
    },
    {
      title: 'Camera 3',
      method: 'camera3'
    },
    {
      title: 'Camera Random',
      method: 'cameraRandom'
    }
  ]
}
