import {
  getNextEnumValue,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
  getOptionNodesFromIds,
  NodeValue,
} from '@hedron/engine'

const TAU = Math.PI * 2
const lerp = (v0: number, v1: number, t: number) => (1 - t) * v0 + t * v1

export class LFOInput implements IPlugin {
  public readonly id = 'lfo-input'
  public readonly name = 'LFO Input'
  public readonly inputType = 'lfo'
  public readonly description =
    'Generates LFO waves (e.g. sin, square, sawtooth) as inputs for params.'
  public readonly optionNodesConfig = [
    {
      key: 'isEnabled',
      valueType: 'boolean',
      defaultValue: true,
    },
    {
      key: 'frequency',
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
      valueType: 'number',
      defaultValue: 1,
    },
    {
      key: 'phase',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      key: 'min',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      key: 'max',
      valueType: 'number',
      defaultValue: 1,
    },
  ] as const satisfies InputOptionNodesConfig

  private inputLatches: Record<string, boolean> = {}

  constructor(engine: HedronEngine) {
    const clock = engine.clock

    if (!clock) {
      throw new Error('Clock plugin is required for LFOInput to function.')
    }

    const store = engine.getStore()

    const tick = () => {
      requestAnimationFrame(() => {
        const storeState = store.getState()
        const inputs = Object.values(storeState.inputs)

        // TODO: Not very performant, we might want to cache inputs somehow
        // Could have some method that does this for us (and passes down option node IDs?)
        inputs.forEach((input) => {
          if (input.type !== 'lfo') return

          const options = getOptionNodesFromIds<typeof this.optionNodesConfig>(
            storeState,
            input.optionNodeIds,
          )

          if (!options.isEnabled) return

          const delta = clock.beatDelta * options.frequency * TAU + options.phase

          const node = storeState.nodes[input.targetNodeId]

          let value: NodeValue | null = null

          switch (node.valueType) {
            case 'enum':
              if (Math.sin(delta) > 0) {
                if (this.inputLatches[input.id]) {
                  return
                }
                value = getNextEnumValue(input.targetNodeId)(storeState)
                this.inputLatches[input.id] = true
              } else {
                this.inputLatches[input.id] = false
                return
              }

              break
            case 'boolean':
              value = Math.sin(delta) > 0
              break
            case 'number':
              switch (options.waveType) {
                case 'sine':
                  value =
                    lerp(options.min, options.max, (Math.sin(delta) + 1) / 2) * options.amplitude
                  break
                case 'square':
                  value =
                    lerp(options.min, options.max, (Math.sign(Math.sin(delta)) + 1) / 2) *
                    options.amplitude
                  break
                case 'sawtooth':
                  value = lerp(options.min, options.max, (delta % TAU) / TAU) * options.amplitude
                  break
                case 'triangle':
                  value =
                    lerp(options.min, options.max, 1 - Math.abs(((delta % TAU) / TAU) * 2 - 1)) *
                    options.amplitude
                  break
              }
          }

          if (value === null) {
            console.warn(
              `LFO Input: Unsupported value type for node ${input.targetNodeId}. Type: ${node.valueType}`,
            )
            return
          }

          storeState.updateNodeValue(input.targetNodeId, value)
        })

        tick()
      })
    }
    tick()
  }
}
