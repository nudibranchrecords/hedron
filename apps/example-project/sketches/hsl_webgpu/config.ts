export default {
  title: 'HSL (WebGPU)',
  description: 'Hue, Saturation, Lightness',
  params: [
    {
      title: 'Hue',
      key: 'hue',
      defaultValue: 0.0,
      sliderMin: -Math.PI,
      sliderMax: Math.PI,
    },
    {
      title: 'Saturation',
      key: 'saturation',
      defaultValue: 1.0,
      sliderMin: 0,
      sliderMax: 5,
    },
    {
      title: 'Luminance',
      key: 'luminance',
      defaultValue: 1.0,
      sliderMin: 0,
      sliderMax: 5,
    },
  ],
}
