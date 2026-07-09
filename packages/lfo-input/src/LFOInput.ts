import {
  ConfigToOptionsType,
  EngineState,
  getNextEnumValue,
  handleEachInput,
  HedronEngine,
  InputNode,
  IPlugin,
  ParamValue,
  ParamNode,
} from '@hedron-gl/engine'

const TAU = Math.PI * 2
const lerp = (v0: number, v1: number, t: number) => (1 - t) * v0 + t * v1

type ValueHander = (params: {
  delta: number
  input: InputNode
  storeState: EngineState
  optionNodes: ConfigToOptionsType<typeof LFOInput.prototype.optionNodesConfig>
  targetNode: ParamNode
}) => ParamValue | null

type ShotHandler = (params: { delta: number; input: InputNode; engine: HedronEngine }) => void

export class LFOInput implements IPlugin {
  public readonly id = 'lfo-input'
  public readonly name = 'LFO Input'
  public readonly inputType = 'lfo'
  public readonly iconName = 'vital_signs'
  public readonly description =
    'Generates LFO waves (e.g. sin, square, sawtooth) as inputs for params.'
  public readonly optionNodesConfig = [
    {
      key: 'isEnabled',
      nodeType: 'param',
      valueType: 'boolean',
      defaultValue: true,
    },
    {
      key: 'frequency',
      nodeType: 'param',
      valueType: 'enum',
      defaultValue: 1,
      options: [
        {
          value: 32,
          label: '32',
        },
        {
          value: 16,
          label: '16',
        },
        {
          value: 8,
          label: '8',
        },
        {
          value: 4,
          label: '4',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 1,
          label: '1',
        },
        {
          value: 1 / 2,
          label: '1/2',
        },
        {
          value: 1 / 4,
          label: '1/4',
        },
        {
          value: 1 / 8,
          label: '1/8',
        },
        {
          value: 1 / 16,
          label: '1/16',
        },
        {
          value: 1 / 32,
          label: '1/32',
        },
      ],
    },
    {
      key: 'waveType',
      nodeType: 'param',
      valueType: 'enum',
      defaultValue: 'sine',
      options: [
        { value: 'sine', label: 'Sine' },
        { value: 'square', label: 'Square' },
        { value: 'sawtooth', label: 'Sawtooth' },
        { value: 'triangle', label: 'Triangle' },
      ],
    },
    {
      key: 'amplitude',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: 1,
    },
    {
      key: 'phase',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      key: 'min',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      key: 'max',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: 1,
    },
  ] as const satisfies IPlugin['optionNodesConfig']

  private inputLatches: Record<string, boolean> = {}

  private lastClockBeatDelta: number = -1

  private handleShot: ShotHandler = ({ delta, input, engine }) => {
    const val = Math.sin(delta)

    if (val > 0 && !this.inputLatches[input.id]) {
      this.inputLatches[input.id] = true

      engine.fireShot(input.targetNodeId)
      return
    } else if (val <= 0) {
      this.inputLatches[input.id] = false
    }
  }

  private handleEnum: ValueHander = ({ delta, input, storeState }) => {
    if (Math.sin(delta) > 0) {
      if (this.inputLatches[input.id]) {
        return null
      }

      this.inputLatches[input.id] = true
      return getNextEnumValue(input.targetNodeId)(storeState) ?? null
    } else {
      this.inputLatches[input.id] = false
      return null
    }
  }

  private handleBoolean: ValueHander = ({ delta }) => {
    return Math.sin(delta) > 0
  }

  private handleNumber: ValueHander = ({ delta, optionNodes: opts }) => {
    return {
      sine: () => lerp(opts.min, opts.max, (Math.sin(delta) + 1) / 2) * opts.amplitude,
      square: () => lerp(opts.min, opts.max, (Math.sign(Math.sin(delta)) + 1) / 2) * opts.amplitude,
      sawtooth: () => lerp(opts.min, opts.max, (delta % TAU) / TAU) * opts.amplitude,
      triangle: () =>
        lerp(opts.min, opts.max, 1 - Math.abs(((delta % TAU) / TAU) * 2 - 1)) * opts.amplitude,
    }[opts.waveType]()
  }

  private handleUnsupported: ValueHander = ({ input, targetNode }) => {
    console.warn(
      `LFO Input: Unsupported value type for node ${input.targetNodeId}. Type: ${targetNode.valueType}`,
    )

    return null
  }

  constructor(engine: HedronEngine) {
    const clock = engine.clock

    if (!clock) {
      throw new Error('Clock plugin is required for LFOInput to function.')
    }

    const store = engine.getStore()

    const tick = () => {
      requestAnimationFrame(() => {
        if (clock.beatDelta === this.lastClockBeatDelta) {
          tick()
          return
        }

        this.lastClockBeatDelta = clock.beatDelta

        const storeState = store.getState()
        handleEachInput<typeof this.optionNodesConfig>(
          storeState,
          this.inputType,
          ({ input, optionNodes, targetNode }) => {
            const delta = (clock.beatDelta * optionNodes.frequency + optionNodes.phase) * TAU

            // TODO: This can be handled by `onInput` once we have `isEnabled` as a generic option
            if (!optionNodes.isEnabled) return

            if (targetNode.nodeType === 'shot') {
              this.handleShot({
                delta,
                input,
                engine,
              })
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
              delta,
              input,
              storeState,
              optionNodes,
              targetNode,
            })

            if (value === null) {
              return
            }

            storeState.updateParamValue(input.targetNodeId, value)
          },
        )

        tick()
      })
    }
    tick()
  }
}
