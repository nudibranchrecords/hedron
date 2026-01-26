import { HedronEngine } from '@hedron/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Clock } from '@hedron/clock'
import { MidiInput, MidiInputPanel } from '@hedron/midi-input'
import {
  GamepadInput,
  GamepadInputPanel,
  GamepadGlobalWidget,
  GamepadGlobalPanel,
} from '@hedron/gamepad-input'
import { LFOInput, LFOInputPanel } from '@hedron/lfo-input'
import {
  AudioInput,
  AudioInputPanel,
  AudioGlobalWidget,
  AudioGlobalPanel,
} from '@hedron/audio-input'

export const performanceMonitor = new Stats()

// TODO: This will eventually be handed to the engine but there's nothing to use it for yet
export const clock = new Clock()

export const engine = new HedronEngine({
  onFrameStart: performanceMonitor.begin,
  onFrameEnd: performanceMonitor.end,
  rendererType: import.meta.env.HEDRON_RENDERER_TYPE ?? 'webgl',
  canvasSizeMode: 'fixedAspectRatio',
  clock,
})

export const engineStore = engine.getStore()

engine.registerPlugin(new MidiInput(engine))
engine.registerPlugin(new LFOInput(engine))
engine.registerPlugin(new AudioInput(engine))
engine.registerPlugin(new GamepadInput(engine))

export const pluginViews = {
  inputPanel: {
    midi: MidiInputPanel,
    lfo: LFOInputPanel,
    audio: AudioInputPanel,
    gamepad: GamepadInputPanel,
  },
  globalPanel: {
    audio: {
      widget: AudioGlobalWidget,
      panel: AudioGlobalPanel,
    },
    gamepad: {
      widget: GamepadGlobalWidget,
      panel: GamepadGlobalPanel,
    },
  },
}
