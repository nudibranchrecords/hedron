const noteLetters = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

export const midiNotes = new Array(128)

for (let i = 0; i < 128; i++) {
  const letter = noteLetters[i % noteLetters.length]
  const octave = Math.floor(i / noteLetters.length) - 1
  midiNotes[i] = `${i} - ${letter} (${octave})`
}

export const messageTypes = {
  // These represent ranges of 16
  '80': { key: 'noteOff', title: 'Note Off' },
  '90': { key: 'noteOn', title: 'Note On' },
  'b0': { key: 'controlChange', title: 'Control Change' },
  'c0': { key: 'programChange', title: 'Program Change' },
}

export const processMidiData = data => {
  let value, messageType, id

  const d0 = data[0] // messageType + channel
  const d1 = data[1] // Note number
  const d2 = data[2] // Velocity

  const channel = d0 & 0x0f

  // If the midi message is less than 240, it involves channels
  if (d0 < 0xf0) {
    // Erase the first bit as this relates to channel
    const code = d0 & 0xf0
    const messageTypeObj = messageTypes[code.toString(16)]
    if (messageTypeObj !== undefined) {
      messageType = messageTypeObj.key

      // If it's a noteOn but value is 0, make it a noteOff
      if (messageType === 'noteOn' && d2 === 0) {
        messageType = 'noteOff'
      }
    }
  } else if (d0 === 248) {
    messageType = 'timingClock'
  }

  if (d2 !== undefined) {
    value = d2 / 127
  }

  if (d0 !== undefined && d1 !== undefined) {
    id = `midi_${d0}_${d1}`
  }

  return {
    value, id, messageType, channel, noteNum: d1,
  }
}

export const constructMidiId = (messageType, noteNum, channel) => {
  const typeHex = Object.keys(messageTypes).find(hex => messageTypes[hex].key === messageType)
  return `midi_${parseInt(typeHex, 16) + channel}_${noteNum}`
}

export const processMidiId = id => {
  const parts = id.split('_')
  const data = [parseInt(parts[1]), parseInt(parts[2]), 1]

  return processMidiData(data)
}
