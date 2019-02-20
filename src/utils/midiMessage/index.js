export const processMidiMessage = message => {
  let value, type, id

  const d0 = message.data[0]
  const d1 = message.data[1]
  const d2 = message.data[2]

  // Erase the first bit as this relates to channel
  const code = d0 & 0xf0

  switch (code) {
    case 0x80:
      type = 'noteOff'
      break
    case 0x90:
      type = d2 === 0 ? 'noteOff' : 'noteOn'
      break
    case 0xA0:
      type = 'polyPressure'
      break
    case 0xB0:
      type = 'controlChange'
      break
    case 0xC0:
      type = 'programChange'
      break
    default:
      if (d0 === 248) type = 'timingClock'
      break
  }

  if (d2 !== undefined) {
    value = d2 / 127
  }

  if (d0 !== undefined && d1 !== undefined) {
    id = `midi_${d0}_${d1}`
  }

  return {
    value, id, type,
  }
}
