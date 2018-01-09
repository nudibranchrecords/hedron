// What to do with current node value and incoming midi value
// Encoder type MIDI will + or - from value
// Absolute type MIDI will completely replace the values
// *** Currently just doing encoder type ***

export default (nodeValue, midiValue, messageCount, sensitivity = 0.5, node) => {
  let value
  const inc = midiValue !== 1

  if (node.type === 'select') {
    const opts = node.options
    let index = opts.findIndex(item => item.value === nodeValue)

    if (inc) {
      index = Math.min(opts.length - 1, index + 1)
    } else {
      index = Math.max(0, index - 1)
    }

    value = opts[index].value
  } else {
    const s = sensitivity * 0.014
    if (inc) {
      value = nodeValue + (s * messageCount)
    } else {
      value = nodeValue - (s * messageCount)
    }
    value = Math.max(0, Math.min(1, value))
  }
  return value
}
