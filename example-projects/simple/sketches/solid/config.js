/** HEDRON TIP **
  The config.js defines how the sketch file is used by Hedron.
**/

module.exports = {
  // Default title when sketch is loaded in (can be changed by user)
  defaultTitle: 'Solid',
  // Params are values between 0 and 1 that can be manipulated by the user
  // these values are sent to the sketch every frame
  // e.g. Speed, scale, colour
  params: [
    {
      key: 'rotSpeedX', // needs to be unique
      title: 'Rotation Speed X', // should be human
      defaultValue: 0 // must be between 0 and 1
    },
    {
      key: 'rotSpeedY',
      title: 'Rotation Speed Y',
      defaultValue: 0
    },
    {
      key: 'rotSpeedZ',
      title: 'Rotation Speed Z',
      defaultValue: 0
    },
    {
      key: 'scale',
      title: 'Scale',
      defaultValue: 0.5
    },
    {
      key: 'meshIndex',
      title: 'Mesh Index',
      defaultValue: 0
    }
  ],
  // Shots are single functions that can fire, as opposed to values that change
  // e.g. Explosions, Pre-defined animations
  shots: [
    {
      method: 'shapeShift', // needs to be unique
      title: 'Shape Shift' // should be human
    }
  ]
}
