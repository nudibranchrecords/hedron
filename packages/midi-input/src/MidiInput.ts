import {
  getNextEnumValue,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
  NodeValue,
  handleEachInput,
} from '@hedron/engine'
import { MidiManager, MidiMessageType } from '@hedron/midi-manager'

const noteLetters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const midiNotes: string[] = new Array(128)

for (let i = 0; i < 128; i++) {
  const letter = noteLetters[i % noteLetters.length]
  const octave = Math.floor(i / noteLetters.length) - 1
  midiNotes[i] = `${i} - ${letter} (${octave})`
}

export class MidiInput implements IPlugin {
  public readonly id = 'midi-input'
  public readonly name = 'MIDI Input'
  public readonly inputType = 'midi'
  public readonly description = 'Handles MIDI input devices and messages.'
  public readonly midiManager = new MidiManager()
  public readonly optionNodesConfig = [
    {
      key: 'channel',
      valueType: 'enum',
      options: Array.from({ length: 16 }, (_, i) => ({ value: i, label: `${i + 1}` })),
      defaultValue: 1,
    },
    {
      key: 'note',
      valueType: 'enum',
      options: midiNotes.map((label, i) => ({ value: i, label })),
      defaultValue: 1,
    },
    {
      key: 'type',
      valueType: 'enum',
      defaultValue: MidiMessageType.ControlChange,
      options: [
        { value: MidiMessageType.NoteOn, label: 'Note On' },
        { value: MidiMessageType.NoteOff, label: 'Note Off' },
        { value: MidiMessageType.ControlChange, label: 'Control Change' },
      ],
    },
  ] as const satisfies InputOptionNodesConfig

  constructor(engine: HedronEngine) {
    const store = engine.getStore()

    this.midiManager.onMidiMessage.add((event) => {
      const storeState = store.getState()

      // TODO: Filter out clock

      handleEachInput<typeof this.optionNodesConfig>(
        storeState,
        'midi',
        ({ input, optionNodes: opts, targetNode, targetNodeValue }) => {
          if (input.type !== 'midi') return

          if (
            event.channel === opts.channel &&
            event.note === opts.note &&
            event.type === opts.type &&
            event.value !== undefined
          ) {
            const sliderMin =
              (storeState.nodeValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
            const sliderMax =
              (storeState.nodeValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

            let value: NodeValue | null = null

            switch (targetNode.valueType) {
              case 'boolean':
                switch (event.type) {
                  case MidiMessageType.NoteOn:
                  case MidiMessageType.NoteOff:
                    value = !targetNodeValue
                    break
                  default:
                    value = event.value > 0
                    break
                }
                break
              case 'enum': {
                switch (event.type) {
                  case MidiMessageType.NoteOn:
                  case MidiMessageType.NoteOff:
                    value = getNextEnumValue(input.targetNodeId)(storeState)
                    break
                  default: {
                    value =
                      targetNode.options[
                        Math.floor((event.value / 127) * (targetNode.options.length - 1))
                      ].value
                    break
                  }
                }
                break
              }
              case 'number': {
                value = (event.value / 127) * (sliderMax - sliderMin) + sliderMin
                break
              }
            }

            if (value === null) {
              console.warn(
                `MIDI Input: Unsupported value type for node ${input.targetNodeId}. Value: ${event.value}, Type: ${targetNode.valueType}`,
              )
              return
            }

            storeState.updateNodeValue(input.targetNodeId, value)
          }
        },
      )
    })
  }
}
