const noteLetters = [
  'C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B',
]

export const midiNotes = new Array(128)

for (let i = 0; i < 128; i++) {
  const letter = noteLetters[i % noteLetters.length]
  const octave = Math.floor(i / noteLetters.length) - 1
  midiNotes[i] = `${i} - ${letter} (${octave})`
}

export const messageTypes = {
  // These represent ranges of 16
  '80': 'noteOff',
  '90': 'noteOn',
  'b0': 'controlChange',
  'c0': 'programChange',
}

export const processMidiData = data => {
  let value, type, id

  const d0 = data[0]
  const d1 = data[1]
  const d2 = data[2]

  const channel = d0 & 0x0f

  // If the midi message is less than 240, it involves channels
  if (d0 < 0xf0) {
    // Erase the first bit as this relates to channel
    const code = d0 & 0xf0
    type = messageTypes[code.toString(16)]

    // If it's a noteOn but value is 0, make it a noteOff
    if (type === 'noteOn' && d2 === 0) {
      type = 'noteOff'
    }
  } else if (d0 === 248) {
    type = 'timingClock'
  }

  if (d2 !== undefined) {
    value = d2 / 127
  }

  if (d0 !== undefined && d1 !== undefined) {
    id = `midi_${d0}_${d1}`
  }

  return {
    value, id, type, channel,
  }
}

export const constructMidiId = (type, note, channel) =>
  `midi_${parseInt(type, 16) + channel}_${note}`

export const processMidiId = id => {
  const parts = id.split('_')
  const data = [parts[1], parts[2], 1]

  return processMidiData(data)
}
