import { MIDIEvent, MidiMessageType } from '@hedron-gl/midi-manager'
import {
  MIDI_INPUT_TYPE_CONTROL_CHANGE,
  MIDI_INPUT_TYPE_NOTE,
  NOTE_MODE_ON,
  NOTE_MODE_OFF,
  NOTE_MODE_ON_OFF,
} from './constants'

interface MidiInputMatchParams {
  event: MIDIEvent
  channel: number
  note: number
  type: number
  noteMode: number
}

export const doesMidiEventMatchInput = ({
  event,
  channel,
  note,
  type,
  noteMode,
}: MidiInputMatchParams): boolean => {
  if (event.channel !== channel || event.note !== note) {
    return false
  }

  switch (type) {
    case MIDI_INPUT_TYPE_CONTROL_CHANGE:
      return event.type === MidiMessageType.ControlChange

    case MIDI_INPUT_TYPE_NOTE:
      switch (noteMode) {
        case NOTE_MODE_ON:
          return event.type === MidiMessageType.NoteOn

        case NOTE_MODE_OFF:
          return event.type === MidiMessageType.NoteOff

        case NOTE_MODE_ON_OFF:
          return event.type === MidiMessageType.NoteOn || event.type === MidiMessageType.NoteOff

        default:
          console.warn(`doesMidiEventMatchInput: unknown noteMode ${noteMode}`)
          return false
      }

    default:
      return false
  }
}

export const getMidiInputTypeFromEvent = (event: MIDIEvent): number | null => {
  if (event.type === MidiMessageType.ControlChange) return MIDI_INPUT_TYPE_CONTROL_CHANGE
  if (event.type === MidiMessageType.NoteOn || event.type === MidiMessageType.NoteOff) {
    return MIDI_INPUT_TYPE_NOTE
  }
  return null
}
