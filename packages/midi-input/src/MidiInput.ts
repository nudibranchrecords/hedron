import { IPlugin } from '@hedron/engine'
import { Midi } from '@hedron/midi'

export interface MidiInputOptions {
  channel: number
  note: number
}

export class MidiInput implements IPlugin {
  public readonly id = 'midi-input'
  public readonly name = 'MIDI Input'
  public readonly description = 'Handles MIDI input devices and messages.'
  public readonly midiManager = new Midi()
  public readonly generateInputOptions: () => MidiInputOptions = () => ({
    channel: 0,
    note: 0,
  })
}
