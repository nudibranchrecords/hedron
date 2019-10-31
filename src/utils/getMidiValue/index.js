// All values must be divided by 127 to get
// actual value coming into function
const $ = n => Math.round(n / 127 * 1000) / 1000

const downs = {
  rel1: $(127),
  rel2: $(63),
  rel3: $(65),
}

const isInc = (controlType, midiValue) =>
  downs[controlType] !== Math.round(midiValue * 1000) / 1000

// What to do with current node value and incoming midi value
// Based on options like sensitivity and controlType
export const getMidiValue = (nodeValue, midiValue, midiOptions, messageCount) => {
  const { controlType, sensitivity } = midiOptions
  if (controlType === 'abs') {
    return midiValue
  } else {
    let value
    const inc = isInc(controlType, midiValue)
    const step = sensitivity * 0.014

    if (inc) {
      value = nodeValue + (step * messageCount)
    } else {
      value = nodeValue - (step * messageCount)
    }

    return Math.max(0, Math.min(1, value))
  }
}

