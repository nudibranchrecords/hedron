/** HEDRON TIP **
  The config.js defines how the sketch file is used by Hedron.
**/

module.exports = {
  // Default title when sketch is loaded in (can be changed by user)
  defaultTitle: 'Solid',
  // Collapsable category for this sketch to be grouped under
  category:'simple',
  // Params are values between 0 and 1 that can be manipulated by the user
  // these values are sent to the sketch every frame
  // e.g. Speed, scale, colour
  params: [
    {
      key: 'rotSpeedX', // needs to be unique
      title: 'Rotation Speed X', // should be human
      defaultValue: 0.5, // must be between 0 and 1
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'rotSpeedY',
      title: 'Rotation Speed Y',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'rotSpeedZ',
      title: 'Rotation Speed Z',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'scale',
      title: 'Scale',
      defaultValue: 0.5,
      defaultMin: 0.00001,
      defaultMax: 4,
    },
    {
      key: 'meshIndex',
      title: 'Mesh Index',
      defaultValue: 0,
      // meshIndex is changed by the shapeShift shot and not something
      // the user needs to view/edit, so we set hidden:true
      hidden: true,
    },
  ],
  // Shots are single functions that can fire, as opposed to values that change
  // e.g. Explosions, Pre-defined animations
  shots: [
    {
      method: 'shapeShift', // needs to be unique
      title: 'Shape Shift', // should be human
    },
  ],
}
