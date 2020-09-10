module.exports = {
  defaultTitle: 'Color',
  params: [
    {
      key: 'brightness',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'contrast',
      defaultValue: 0.65,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      title: 'Bright/Contr Opacity',
      key: 'brightnessContrastOpacity',
      defaultValue: 1,
    },
    {
      key: 'gamma',
      defaultValue: 0.65,
    },
    {
      key: 'gammaOpacity',
      defaultValue: 1,
    },
    {
      key: 'hue',
      defaultValue: 0.5,
      defaultMin: -Math.PI,
      defaultMax: Math.PI,
    },
    {
      key: 'saturation',
      defaultValue: 0.33,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'hueSaturationOpacity',
      defaultValue: 1,
    },
  ],
}

