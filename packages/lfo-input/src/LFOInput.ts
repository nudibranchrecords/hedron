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
    const store = engine.getStore()
    const clock = engine.clock

    if (!clock) {
      throw new Error('Clock plugin is required for LFOInput to function.')
    }
  }
}
