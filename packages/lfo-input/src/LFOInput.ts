import {
  getNextEnumValue,
  getParamConfig,
  HedronEngine,
  IPlugin,
  NodeTypes,
  NodeValue,
  SketchConfigParamEnum,
} from '@hedron/engine'
import { MidiManager, MidiMessageType } from '@hedron/midi-manager'

export interface LFOInputOptions {
  waveType: 'sine' | 'square' | 'sawtooth' | 'triangle'
  frequency: number
  amplitude: number
  phase: number
}

const TAU = Math.PI * 2

export class LFOInput implements IPlugin {
  public readonly id = 'lfo-input'
  public readonly name = 'LFO Input'
  public readonly inputType = 'lfo'
  public readonly description =
    'Generates LFO waves (e.g. sin, square, sawtooth) as inputs for params.'
  public readonly generateInitialOptions: () => LFOInputOptions = () => ({
    waveType: 'sine',
    frequency: 1,
    amplitude: 1,
    phase: 0,
  })

  constructor(engine: HedronEngine) {
    const clock = engine.clock

    if (!clock) {
      throw new Error('Clock plugin is required for LFOInput to function.')
    }

    const store = engine.getStore()

    const tick = () => {
      requestAnimationFrame(() => {
        const d = clock.beatDelta
        const storeState = store.getState()
        const inputs = Object.values(storeState.inputs)

        // TODO: Not very performant, we might want to cache inputs somehow
        inputs.forEach((input) => {
          if (input.type !== 'lfo') return

          const options = input.options as LFOInputOptions
          // const node = storeState.nodes[input.targetNodeId]
          // const nodeVal = storeState.nodeValues[input.targetNodeId]

          const value = Math.sin(d * TAU)

          store.getState().updateNodeValue(input.targetNodeId, value)
        })

        tick()
      })
    }

    tick()
  }
}
