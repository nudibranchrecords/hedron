/** HEDRON TIP **
  The config.js defines how the sketch file is used by Hedron.
**/

module.exports = {
  // Default title when sketch is loaded in (can be changed by user)
  defaultTitle: 'Point',
  // Params are values between 0 and 1 that can be manipulated by the user
  // these values are sent to the sketch every frame
  // e.g. Speed, scale, colour
  params: [
    {
      key: 'posX', // needs to be unique
      title: 'Pos X', // should be human
      defaultValue: 0.5, // must be between 0 and 1
    },
    {
      key: 'posY',
      title: 'Pos Y',
      defaultValue: 0.5,
    },
    {
      key: 'posZ',
      title: 'Pos Z',
      defaultValue: 0.5,
    },
  ],
  shots: [
  ],
}
