import { HedronEngine, IPlugin } from '@hedron/engine'
import { Midi, MidiMessageTypeKey } from '@hedron/midi'

export interface MidiInputOptions {
  channel: number
  note: number
  type: MidiMessageTypeKey
}

export class MidiInput implements IPlugin {
  public readonly id = 'midi-input'
  public readonly name = 'MIDI Input'
  public readonly inputType = 'midi'
  public readonly description = 'Handles MIDI input devices and messages.'
  public readonly midiManager = new Midi()
  public readonly generateInitialOptions: () => MidiInputOptions = () => ({
    channel: 1,
    note: 1,
    type: 'ControlChange',
  })

  constructor(engine: HedronEngine) {
    const store = engine.getStore()
    this.midiManager.onMidiMessage.add((event) => {
      const inputs = Object.values(store.getState().inputs)

      // TODO: Filter out clock

      // TODO: Not very performant, we might want to cache inputs somehow
      inputs.forEach((input) => {
        if (input.type !== 'midi') return
        const options = input.options as MidiInputOptions
        if (
          event.channel === options.channel &&
          event.note === options.note &&
          event.type === options.type &&
          event.value !== undefined
        ) {
          // TODO: Different behaviours depending on the node type
          store.getState().updateNodeValue(input.targetNodeId, event.value / 128)
        }
      })
    })
  }
}
