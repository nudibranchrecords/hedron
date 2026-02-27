import {
  getNextEnumValue,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
  NodeValue,
  handleEachInput,
  Input,
  ConfigToOptionsType,
  Param,
  EngineStateWithActions,
} from '@hedron-gl/engine'
import { MIDIEvent, MidiManager, MidiMessageType } from '@hedron-gl/midi-manager'
import { NodeParamEnum } from 'node_modules/@hedron-gl/engine/dist'

const noteLetters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const midiNotes: string[] = new Array(128)

for (let i = 0; i < 128; i++) {
  const letter = noteLetters[i % noteLetters.length]
  const octave = Math.floor(i / noteLetters.length) - 1
  midiNotes[i] = `${i} - ${letter} (${octave})`
}

type MIDIEventWithValue = Omit<MIDIEvent, 'value'> & { value: number }

type ValueHander<T = Param> = (params: {
  midiEvent: MIDIEventWithValue
  input: Input
  storeState: EngineStateWithActions
  optionNodes: ConfigToOptionsType<typeof MidiInput.prototype.optionNodesConfig>
  targetNode: T
  targetNodeValue: NodeValue
}) => NodeValue | null

type ShotHandler = (params: {
  input: Input
  engine: HedronEngine
  midiEvent: MIDIEventWithValue
}) => void

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
    {
      key: 'overrideValue',
      title: 'Override Value',
      description: 'Override the incoming MIDI value with this value (0-127). Set to a negative value to use the actual MIDI value.',
      valueType: 'number',
      defaultValue: -1,
      sliderMin: -1,
      sliderMax: 127,
    },
  ] as const satisfies InputOptionNodesConfig

  private handleShot: ShotHandler = ({ input, engine, midiEvent }) => {
    engine.fireShot(input.targetNodeId, { _midiEvent: midiEvent })
  }

  private handleEnum: ValueHander<NodeParamEnum> = ({
    midiEvent,
    input,
    storeState,
    optionNodes,
    targetNode,
  }) => {
    switch (midiEvent.type) {
      case MidiMessageType.NoteOn:
      case MidiMessageType.NoteOff:
        return getNextEnumValue(input.targetNodeId)(storeState)
      default: {
        const value = optionNodes.overrideValue < 0 ? midiEvent.value : optionNodes.overrideValue
        return targetNode.options[Math.floor((value / 127) * (targetNode.options.length - 1))].value
      }
    }
  }

  private handleBoolean: ValueHander = ({ midiEvent, optionNodes, targetNodeValue }) => {
    switch (midiEvent.type) {
      case MidiMessageType.NoteOn:
      case MidiMessageType.NoteOff:
        return !targetNodeValue
      default: {
        const value = optionNodes.overrideValue < 0 ? midiEvent.value : optionNodes.overrideValue
        return value > 0
      }
    }
  }

  private handleNumber: ValueHander = ({ midiEvent, storeState, input, optionNodes }) => {
    const sliderMin = (storeState.nodeValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
    const sliderMax = (storeState.nodeValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

    const value = optionNodes.overrideValue < 0 ? midiEvent.value : optionNodes.overrideValue
    return (value / 127) * (sliderMax - sliderMin) + sliderMin
  }

  private handleUnsupported: ValueHander = ({ input, targetNode, midiEvent }) => {
    console.warn(
      `MIDI Input: Unsupported value type for node ${input.targetNodeId}. Value: ${midiEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  constructor(engine: HedronEngine) {
    const store = engine.getStore()

    this.midiManager.onMidiMessage.add((event) => {
      const storeState = store.getState()

      // TODO: Filter out clock

      handleEachInput<typeof this.optionNodesConfig>(
        storeState,
        'midi',
        ({ input, optionNodes, targetNode, targetNodeValue }) => {
          if (
            event.channel === optionNodes.channel &&
            event.note === optionNodes.note &&
            event.type === optionNodes.type &&
            event.value !== undefined
          ) {
            if (targetNode.nodeType === 'shot') {
              this.handleShot({ input, engine, midiEvent: event as MIDIEventWithValue })
              return
            }

            const value = {
              enum: this.handleEnum,
              boolean: this.handleBoolean,
              number: this.handleNumber,
              string: this.handleUnsupported,
              rgb: this.handleUnsupported,
              vector2: this.handleUnsupported,
              vector3: this.handleUnsupported,
            }[targetNode.valueType]({
              midiEvent: event as MIDIEventWithValue,
              input,
              storeState,
              optionNodes,
              // @ts-expect-error -- TS isn't smart enough to infer the correct node type
              targetNode,
              targetNodeValue,
            })

            if (value === null) {
              return
            }

            storeState.updateNodeValue(input.targetNodeId, value)
          }
        },
      )
    })
  }
}
