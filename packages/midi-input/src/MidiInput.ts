import { HedronEngine, IPlugin } from '@hedron/engine'
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
  public readonly generateInitialOptions: () => MidiInputOptions = () => ({
    channel: 0,
    note: 0,
  })

  constructor(engine: HedronEngine) {
    const store = engine.getStore()
    this.midiManager.onMidiMessage.add((event) => {
      const inputs = Object.values(store.getState().inputs)

      // TODO: Not very performant, we might want to cache inputs somehow
      inputs.forEach((input) => {
        if (input.type !== 'midi') return
        const options = input.options as MidiInputOptions
        if (
          event.channel === options.channel &&
          event.note === options.note &&
          event.value !== undefined
        ) {
          store.getState().updateNodeValue(input.targetNodeIds[0], event.value / 128)
        }
      })
    })
  }
}
