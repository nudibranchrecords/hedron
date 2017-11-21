// What to do with current node value and incoming midi value
// Encoder type MIDI will + or - from value
// Absolute type MIDI will completely replace the values
// *** Currently just doing encoder type ***

export default (nodeValue, midiValue) => {
  let value
  if (midiValue === 1) {
    value = nodeValue - 0.004
  } else {
    value = nodeValue + 0.004
  }
  value = Math.max(0, Math.min(1, value))
  return value
}
