import {
  getNextEnumValue,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
  NodeTypes,
  NodeValue,
} from '@hedron/engine'
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
  public readonly getOptionNodesConfig: () => MidiInputOptions = () => ({
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
          const nodeVal = storeState.nodeValues[input.targetNodeId]

          let value: NodeValue | null = null

          switch (node.valueType) {
            case NodeTypes.Boolean:
              switch (event.type) {
                case MidiMessageType.NoteOn:
                case MidiMessageType.NoteOff:
                  value = !nodeVal
                  break
                default:
                  value = event.value > 0
                  break
              }
              break
            case NodeTypes.Enum: {
              switch (event.type) {
                case MidiMessageType.NoteOn:
                case MidiMessageType.NoteOff:
                  value = getNextEnumValue(input.targetNodeId)(storeState)
                  break
                default: {
                  value =
                    node.options[Math.floor((event.value / 127) * (node.options.length - 1))].value
                  break
                }
              }
              break
            }
            case NodeTypes.Number:
              value = event.value / 127
              break
          }

          if (value === null) {
            console.warn(
              `MIDI Input: Unsupported value type for node ${input.targetNodeId}. Value: ${event.value}, Type: ${node.valueType}`,
            )
            return
          }

          store.getState().updateNodeValue(input.targetNodeId, value)
        }
      })
    })
  }
  optionNodesConfig: InputOptionNodesConfig
}
