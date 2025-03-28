import { IPlugin, ParamWithInfo } from '@hedron/engine'
import { Midi } from '@hedron/midi'

export class MidiInput implements IPlugin {
  public readonly name: string = 'MIDI'
  public readonly description: string = 'Handles MIDI input devices and messages.'
  public readonly midiManager: Midi = new Midi()
  getSelectedParamView?: ((param: ParamWithInfo) => JSX.Element | undefined) | undefined
}
