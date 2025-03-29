import { IPlugin } from '@hedron/engine'
import { Midi } from '@hedron/midi'

export class MidiInput implements IPlugin {
  public readonly id: string = 'midi-input'
  public readonly name: string = 'MIDI Input'
  public readonly description: string = 'Handles MIDI input devices and messages.'
  public readonly midiManager: Midi = new Midi()
}
