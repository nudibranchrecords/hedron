// What to do with current node value and incoming midi value
// Encoder type MIDI will + or - from value
// Absolute type MIDI will completely replace the values
// *** Currently just doing encoder type ***

export default (nodeValue, midiValue, messageCount, sensitivity = 0.5) => {
  let value
  const s = sensitivity * 0.014
  if (midiValue === 1) {
    value = nodeValue - (s * messageCount)
  } else {
    value = nodeValue + (s * messageCount)
  }
  value = Math.max(0, Math.min(1, value))
  return value
}
