import { HedronEngine } from '@hedron-gl/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Clock } from '@hedron-gl/clock'
import { MidiInput, MidiInputPanel, MidiGlobalWidget, MidiGlobalPanel } from '@hedron-gl/midi-input'
import {
  GamepadInput,
  GamepadInputPanel,
  GamepadGlobalWidget,
  GamepadGlobalPanel,
} from '@hedron-gl/gamepad-input'
import { LFOInput, LFOInputPanel } from '@hedron-gl/lfo-input'
import {
  AudioInput,
  AudioInputPanel,
  AudioGlobalWidget,
  AudioGlobalPanel,
} from '@hedron-gl/audio-input'
import { TimelineInput, TimelineGlobalWidget, TimelineGlobalPanel } from '@hedron-gl/timeline'
import {
  SceneControlPlugin,
  SceneControlGlobalWidget,
  SceneControlGlobalPanel,
} from '@hedron-gl/scene-control'

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
engine.registerPlugin(new TimelineInput())
engine.registerPlugin(new SceneControlPlugin())

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
    midi: {
      widget: MidiGlobalWidget,
      panel: MidiGlobalPanel,
    },
    timeline: {
      widget: TimelineGlobalWidget,
      panel: TimelineGlobalPanel,
    },
    sceneControl: {
      widget: SceneControlGlobalWidget,
      panel: SceneControlGlobalPanel,
    },
  },
}
