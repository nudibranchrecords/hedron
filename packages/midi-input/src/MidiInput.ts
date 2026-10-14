import {
  getNextEnumValue,
  HedronEngine,
  IPlugin,
  ParamValue,
  handleEachInput,
  InputNode,
  ConfigToOptionsType,
  ParamNode,
  ParamEnum,
  EngineStateWithActions,
} from '@hedron-gl/engine'

import { MIDIEvent, MidiManager, MidiMessageType } from '@hedron-gl/midi-manager'
import { getNodeOptionNodes } from '@hedron-gl/ui-core'
import {
  MIDI_INPUT_TYPE_CONTROL_CHANGE,
  MIDI_INPUT_TYPE_NOTE,
  NOTE_MODE_ON,
  NOTE_MODE_OFF,
  NOTE_MODE_ON_OFF,
  MIDI_NOTES,
} from './constants'
import { doesMidiEventMatchInput, getMidiInputTypeFromEvent } from './utils'

type MIDIEventWithValue = Omit<MIDIEvent, 'value'> & { value: number }

type ValueHander<T = ParamNode> = (params: {
  midiEvent: MIDIEventWithValue
  input: InputNode
  storeState: EngineStateWithActions
  optionNodes: ConfigToOptionsType<typeof MidiInput.prototype.optionNodesConfig>
  targetNode: T
  targetParamValue: ParamValue
}) => ParamValue | null

type ShotHandler = (params: {
  input: InputNode
  engine: HedronEngine
  midiEvent: MIDIEventWithValue
}) => void

export class MidiInput implements IPlugin {
  public readonly id = 'midi-input'
  public readonly name = 'MIDI Input'
  public readonly iconName = 'piano'
  public readonly inputType = 'midi'
  public readonly description = 'Handles MIDI input devices and messages.'
  public readonly midiManager = new MidiManager()
  public readonly globalOptionNodesConfig = [
    {
      nodeType: 'param',
      key: 'smoothing',
      title: 'Smoothing',
      valueType: 'number',
      defaultValue: 0.9,
      sliderMin: 0,
      sliderMax: 0.99,
    },
    {
      nodeType: 'param',
      key: 'autoMidiLearn',
      title: 'Auto MIDI Learn',
      valueType: 'boolean',
      defaultValue: false,
    },
  ] as const satisfies IPlugin['globalOptionNodesConfig']
  public readonly optionNodesConfig = [
    {
      nodeType: 'param',
      key: 'channel',
      valueType: 'enum',
      options: Array.from({ length: 16 }, (_, i) => ({ value: i, label: `${i + 1}` })),
      defaultValue: 1,
    },
    {
      nodeType: 'param',
      key: 'note',
      valueType: 'enum',
      options: MIDI_NOTES.map((label, i) => ({ value: i, label })),
      defaultValue: 1,
    },
    {
      nodeType: 'param',
      key: 'type',
      valueType: 'enum',
      defaultValue: MIDI_INPUT_TYPE_CONTROL_CHANGE,
      options: [
        { value: MIDI_INPUT_TYPE_NOTE, label: 'Note' },
        { value: MIDI_INPUT_TYPE_CONTROL_CHANGE, label: 'Control Change' },
      ],
    },
    {
      nodeType: 'param',
      key: 'noteMode',
      title: 'Note Mode',
      valueType: 'enum',
      defaultValue: NOTE_MODE_ON,
      options: [
        { value: NOTE_MODE_ON, label: 'On' },
        { value: NOTE_MODE_OFF, label: 'Off' },
        { value: NOTE_MODE_ON_OFF, label: 'On/Off' },
      ],
    },
    {
      nodeType: 'param',
      key: 'override',
      title: 'Use Override',
      valueType: 'boolean',
      defaultValue: false,
    },
    {
      nodeType: 'param',
      key: 'overrideValue',
      title: 'Override Value',
      valueType: 'number',
      defaultValue: -1,
      sliderMin: -1,
      sliderMax: 127,
    },
  ] as const satisfies IPlugin['optionNodesConfig']

  private handleShot: ShotHandler = ({ input, engine, midiEvent }) => {
    engine.fireShot(input.targetNodeId, { _midiEvent: midiEvent })
  }

  private getValue(
    optionNodes: ConfigToOptionsType<typeof MidiInput.prototype.optionNodesConfig>,
    midiEvent: MIDIEventWithValue,
  ) {
    const value =
      !optionNodes.override || optionNodes.overrideValue < 0
        ? midiEvent.value
        : optionNodes.overrideValue
    return value
  }

  private handleEnum: ValueHander<ParamEnum> = ({
    midiEvent,
    input,
    storeState,
    optionNodes,
    targetNode,
  }) => {
    switch (midiEvent.type) {
      case MidiMessageType.NoteOn:
      case MidiMessageType.NoteOff:
        return getNextEnumValue(input.targetNodeId)(storeState) ?? null
      default: {
        const value = this.getValue(optionNodes, midiEvent)
        return targetNode.options[Math.floor((value / 127) * (targetNode.options.length - 1))].value
      }
    }
  }

  private handleBoolean: ValueHander = ({ midiEvent, optionNodes, targetParamValue }) => {
    switch (midiEvent.type) {
      case MidiMessageType.NoteOn:
      case MidiMessageType.NoteOff:
        if (optionNodes.noteMode === NOTE_MODE_ON_OFF) {
          // NoteOn → true (pressed), NoteOff → false (released)
          return midiEvent.type === MidiMessageType.NoteOn
        }
        return !targetParamValue
      default: {
        const value = this.getValue(optionNodes, midiEvent)
        return value > 0
      }
    }
  }

  private handleNumber: ValueHander = ({
    midiEvent,
    storeState,
    input,
    optionNodes,
    targetParamValue: currVal,
  }) => {
    const sliderMin = (storeState.paramValues[`${input.targetNodeId}-sliderMin`] as number) ?? 0
    const sliderMax = (storeState.paramValues[`${input.targetNodeId}-sliderMax`] as number) ?? 1

    let targetValue: number
    if (
      optionNodes.type === MIDI_INPUT_TYPE_NOTE &&
      optionNodes.noteMode === NOTE_MODE_ON_OFF &&
      midiEvent.type === MidiMessageType.NoteOff
    ) {
      // Release: snap back to the minimum of the slider range
      targetValue = sliderMin
    } else {
      targetValue =
        (this.getValue(optionNodes, midiEvent) / 127) * (sliderMax - sliderMin) + sliderMin
    }

    // Use MidiManager's smoothing system
    this.midiManager.setSmoothedValue(
      input.id,
      currVal as number,
      targetValue,
      (smoothedValue: number) => {
        storeState.updateParamValue(input.targetNodeId, smoothedValue)
      },
    )

    // Return null to prevent immediate update in the event handler
    return null
  }

  private handleUnsupported: ValueHander = ({ input, targetNode, midiEvent }) => {
    console.warn(
      `MIDI Input: Unsupported value type for node ${input.targetNodeId}. Value: ${midiEvent.value}, Type: ${targetNode.valueType}`,
    )

    return null
  }

  // Shared by onNewInput and the panel's manual "Midi Learn" button, so both stay in sync.
  applyLearnedEvent(engine: HedronEngine, inputId: string, event: MIDIEvent) {
    const state = engine.getStore().getState()
    // Always re-fetch by id: a passed-in InputNode reference can be stale.
    const input = state.nodes[inputId] as InputNode | undefined
    if (!input) return

    const {
      channel: channelNode,
      note: noteNode,
      type: typeNode,
    } = getNodeOptionNodes(state, input.id)

    const learnedType = getMidiInputTypeFromEvent(event)

    if (channelNode) state.updateParamValue(channelNode.id, event.channel)
    if (noteNode) state.updateParamValue(noteNode.id, event.note)
    if (typeNode && learnedType !== null) state.updateParamValue(typeNode.id, learnedType)
  }

  // Runs once at creation, not on every panel mount, unlike a value-inferred "is new" check.
  onNewInput = (engine: HedronEngine, newInput: InputNode) => {
    const store = engine.getStore()

    const autoLearnEnabled = Boolean(
      store.getState().paramValues[`${this.id}-global-autoMidiLearn`],
    )
    if (!autoLearnEnabled) return

    this.midiManager.midiLearn().then((event) => {
      if (!event) return
      this.applyLearnedEvent(engine, newInput.id, event)
    })
  }

  constructor(engine: HedronEngine) {
    const store = engine.getStore()

    // Update smoothing value from global options
    const updateSmoothing = () => {
      const storeState = store.getState()
      const smoothingNodeId = `${this.id}-global-smoothing`
      const smoothingValue = storeState.paramValues[smoothingNodeId] as number | undefined
      this.midiManager.smoothing = smoothingValue ?? 0.9
    }

    // Initial update
    updateSmoothing()

    // Subscribe to state changes to update smoothing
    store.subscribe(() => {
      updateSmoothing()
    })

    this.midiManager.onMidiMessage.add((event) => {
      const storeState = store.getState()

      // TODO: Filter out clock

      handleEachInput<typeof this.optionNodesConfig>(
        storeState,
        'midi',
        ({ input, optionNodes, targetNode, targetParamValue }) => {
          const doesEventMatchInput = doesMidiEventMatchInput({
            event,
            channel: optionNodes.channel,
            note: optionNodes.note,
            type: optionNodes.type,
            noteMode: optionNodes.noteMode,
          })

          if (!doesEventMatchInput || event.value === undefined) return
          const midiEvent = event as MIDIEventWithValue

          if (targetNode.nodeType === 'shot') {
            if (
              optionNodes.type === MIDI_INPUT_TYPE_NOTE &&
              optionNodes.noteMode === NOTE_MODE_ON_OFF &&
              event.type === MidiMessageType.NoteOff
            ) {
              return
            }

            this.handleShot({ input, engine, midiEvent })
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
            file: this.handleUnsupported,
          }[targetNode.valueType]({
            midiEvent,
            input,
            storeState,
            optionNodes,
            // @ts-expect-error -- TS isn't smart enough to infer the correct node type
            targetNode,
            // @ts-expect-error -- TS isn't smart enough to infer the correct node type
            targetParamValue,
          })

          if (value !== null) {
            storeState.updateParamValue(input.targetNodeId, value)
          }
        },
      )
    })
  }
}
