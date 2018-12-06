export default message => {
  let value, type, id

  const d0 = message.data[0]
  const d1 = message.data[1]
  const d2 = message.data[2]

  if (d0 >= 128 && d0 < 144 ||
    d0 >= 144 && d0 < 160 && d2 === 0
  ) {
    type = 'noteOff'
  } else if (d0 >= 144 && d0 < 160) {
    type = 'noteOn'
  } else if (d0 >= 160 && d0 < 176) {
    type = 'polyPressure'
  } else if (d0 >= 176 && d0 < 192) {
    type = 'controlChange'
  } else if (d0 >= 192 && d0 < 208) {
    type = 'programChange'
  } else if (d0 === 248) {
    type = 'timingClock'
  }

  if (d2 !== undefined) {
    value = d2 / 127
  }

  if (d0 !== undefined && d1 !== undefined) {
    id = 'midi_' + d0.toString() + d1.toString()
  }

  return {
    value, id, type,
  }
}
