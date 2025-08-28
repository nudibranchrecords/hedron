import { getNextEnumValue, HedronEngine, IPlugin, NodeTypes, ParamWithInfo } from '@hedron/engine'

const TAU = Math.PI * 2
const lerp = (v0: number, v1: number, t: number) => (1 - t) * v0 + t * v1

export class LFOInput implements IPlugin {
  public readonly id = 'lfo-input'
  public readonly name = 'LFO Input'
  public readonly inputType = 'lfo'
  public readonly description =
    'Generates LFO waves (e.g. sin, square, sawtooth) as inputs for params.'
  // TODO: Fix the types here, something to do with the fact its an array?
  public readonly getOptionNodesConfig = (param: ParamWithInfo) =>
    [
      // {
      //   key: 'frequency',
      //   valueType: 'enum' as const,
      //   defaultValue: 1,
      //   options: [
      //     { value: 1, label: 'TODO1' },
      //     { value: 2, label: 'TODO2' },
      //   ],
      // },
      // {
      //   key: 'waveType',
      //   valueType: 'enum' as const,
      //   defaultValue: 'sine',
      //   options: [
      //     { value: 'sine', label: 'Sine' },
      //     { value: 'square', label: 'Square' },
      //     { value: 'sawtooth', label: 'Sawtooth' },
      //     { value: 'triangle', label: 'Triangle' },
      //   ],
      // },
      {
        key: 'amplitude',
        valueType: 'number' as const,
        defaultValue: 1,
      },
    ] as const

  // TODO: Implement all node options
  // waveType: 'sine',
  // frequency: 1,
  // amplitude: 1,
  // phase: 0,
  // min: 'sliderMin' in param && param.sliderMin !== undefined ? param.sliderMin : 0,
  // max: 'sliderMax' in param && param.sliderMax !== undefined ? param.sliderMax : 1,
  // isEnabled: true,

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
        // inputs.forEach((input) => {
        //   if (input.type !== 'lfo') return

        //   const options = input.options as LFOInputOptions

        //   if (!options.isEnabled) return

        //   const delta = clock.beatDelta * options.frequency * TAU + options.phase

        //   const node = storeState.nodes[input.targetNodeId]
        //   // const nodeVal = storeState.nodeValues[input.targetNodeId]

        //   let value: number | boolean | string | null = null

        //   switch (node.valueType) {
        //     case 'enum':
        //       if (Math.sin(delta) > 0) {
        //         if (this.inputLatches[input.id]) {
        //           return
        //         }
        //         value = getNextEnumValue(input.targetNodeId)(storeState)
        //         this.inputLatches[input.id] = true
        //       } else {
        //         this.inputLatches[input.id] = false
        //         return
        //       }

        //       break
        //     case 'boolean':
        //       value = Math.sin(delta) > 0
        //       break
        //     case 'number':
        //       switch (options.waveType) {
        //         case 'sine':
        //           value =
        //             lerp(options.min, options.max, (Math.sin(delta) + 1) / 2) * options.amplitude
        //           break
        //         case 'square':
        //           value =
        //             lerp(options.min, options.max, (Math.sign(Math.sin(delta)) + 1) / 2) *
        //             options.amplitude
        //           break
        //         case 'sawtooth':
        //           value = lerp(options.min, options.max, (delta % TAU) / TAU) * options.amplitude
        //           break
        //         case 'triangle':
        //           value =
        //             lerp(options.min, options.max, 1 - Math.abs(((delta % TAU) / TAU) * 2 - 1)) *
        //             options.amplitude
        //           break
        //       }
        //   }

        //   if (value === null) {
        //     console.warn(
        //       `LFO Input: Unsupported value type for node ${input.targetNodeId}. Type: ${node.valueType}`,
        //     )
        //     return
        //   }

        //   store.getState().updateNodeValue(input.targetNodeId, value)
        // })

        tick()
      })
    }
    tick()
  }
}
