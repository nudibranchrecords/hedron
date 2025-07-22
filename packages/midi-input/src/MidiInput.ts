import { getNextEnumValue, HedronEngine, IPlugin, NodeTypes } from '@hedron/engine'
import { MidiManager, MidiMessageType } from '@hedron/midi-manager'

export interface MidiInputOptions {
  channel: number
  note: number
  type: MidiMessageType
}

export class MidiInput implements IPlugin {
  public readonly id = 'midi-input'
  public readonly name = 'MIDI Input'
  public readonly inputType = 'midi'
  public readonly description = 'Handles MIDI input devices and messages.'
  public readonly midiManager = new MidiManager()
  public readonly generateInitialOptions: () => MidiInputOptions = () => ({
    channel: 1,
    note: 1,
    type: MidiMessageType.ControlChange,
  })

  constructor(engine: HedronEngine) {
    const store = engine.getStore()

    this.midiManager.onMidiMessage.add((event) => {
      const storeState = store.getState()
      const inputs = Object.values(storeState.inputs)

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
          const node = storeState.nodes[input.targetNodeId]

          let value = null

          switch (node.valueType) {
            case NodeTypes.Boolean:
              value = event.value > 0
              break
            case NodeTypes.Enum: {
              value = getNextEnumValue(input.targetNodeId)(storeState)
              break
            }
            case NodeTypes.Number:
              value = event.value / 128
              break
          }

          if (value === null) {
            console.warn(
              `MIDI Input: Unsupported value type for node ${input.targetNodeId}. Value: ${event.value}`,
            )
            return
          }

          store.getState().updateNodeValue(input.targetNodeId, value)
        }
      })
    })
  }
}
