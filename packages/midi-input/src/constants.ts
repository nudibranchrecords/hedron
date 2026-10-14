export const MIDI_INPUT_TYPE_NOTE = 0 as const
export const MIDI_INPUT_TYPE_CONTROL_CHANGE = 1 as const

export const NOTE_MODE_ON = 0 as const
export const NOTE_MODE_OFF = 1 as const
export const NOTE_MODE_ON_OFF = 2 as const

const noteLetters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const MIDI_NOTES: string[] = new Array(128)

for (let i = 0; i < 128; i++) {
  const letter = noteLetters[i % noteLetters.length]
  const octave = Math.floor(i / noteLetters.length) - 1
  MIDI_NOTES[i] = `${i} - ${letter} (${octave})`
}
