import {
  getNextEnumValue,
  handleEachInput,
  HedronEngine,
  InputOptionNodesConfig,
  IPlugin,
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
        handleEachInput<typeof this.optionNodesConfig>(
          storeState,
          'lfo',
          ({ input, optionNodes: opts, targetNode }) => {
            // TODO: This can be handled by `onInput` once we have `isEnabled` as a generic option
            if (!opts.isEnabled) return

            const delta = clock.beatDelta * opts.frequency * TAU + opts.phase

            let value: NodeValue | null = null

            switch (targetNode.valueType) {
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
                switch (opts.waveType) {
                  case 'sine':
                    value = lerp(opts.min, opts.max, (Math.sin(delta) + 1) / 2) * opts.amplitude
                    break
                  case 'square':
                    value =
                      lerp(opts.min, opts.max, (Math.sign(Math.sin(delta)) + 1) / 2) *
                      opts.amplitude
                    break
                  case 'sawtooth':
                    value = lerp(opts.min, opts.max, (delta % TAU) / TAU) * opts.amplitude
                    break
                  case 'triangle':
                    value =
                      lerp(opts.min, opts.max, 1 - Math.abs(((delta % TAU) / TAU) * 2 - 1)) *
                      opts.amplitude
                    break
                }
            }

            if (value === null) {
              console.warn(
                `LFO Input: Unsupported value type for node ${input.targetNodeId}. Type: ${targetNode.valueType}`,
              )
              return
            }

            storeState.updateNodeValue(input.targetNodeId, value)
          },
        )

        tick()
      })
    }
    tick()
  }
}
