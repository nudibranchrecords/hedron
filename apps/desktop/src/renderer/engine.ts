import { HedronEngine } from '@hedron-gl/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Clock } from '@hedron-gl/clock'
import { MidiInput, MidiInputPanel, MidiGlobalPanel } from '@hedron-gl/midi-input'
import { GamepadInput, GamepadInputPanel, GamepadGlobalPanel } from '@hedron-gl/gamepad-input'
import { LFOInput, LFOInputPanel } from '@hedron-gl/lfo-input'
import { AudioInput, AudioInputPanel, AudioGlobalPanel } from '@hedron-gl/audio-input'
import { TimelineInput, TimelineGlobalPanel, TimelineInputPanel } from '@hedron-gl/timeline'
import { SceneControlPlugin, SceneControlGlobalPanel } from '@hedron-gl/scene-control'
import { VideoRenderPlugin, VideoRenderGlobalPanel } from '@hedron-gl/video-render'
import { ParamPresetsPlugin, ParamPresetsPanel } from '@hedron-gl/param-presets'
import { videoRenderCallbacks } from '@renderer/utils/renderVideo/videoRenderCallbacks'

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

const timelineInput = new TimelineInput()
const audioInput = new AudioInput(engine)

engine.registerPlugin(new MidiInput(engine))
engine.registerPlugin(timelineInput)
engine.registerPlugin(new LFOInput(engine))
engine.registerPlugin(audioInput)
engine.registerPlugin(new GamepadInput(engine))
engine.registerPlugin(new SceneControlPlugin())
engine.registerPlugin(new VideoRenderPlugin(videoRenderCallbacks))
engine.registerPlugin(new ParamPresetsPlugin())

// Routes the timeline's audio element into the audio-input analyser for live preview.
// Wired here, not in either package, so neither depends on the other.
timelineInput.onAudioElementChange((element) => {
  audioInput.setLiveElementSource(element)
})

export const pluginViews = {
  inputPanel: {
    midi: MidiInputPanel,
    lfo: LFOInputPanel,
    audio: AudioInputPanel,
    gamepad: GamepadInputPanel,
    ['timeline-track']: TimelineInputPanel,
  },
  globalPanel: {
    ['audio-input']: AudioGlobalPanel,
    ['midi-input']: MidiGlobalPanel,
    ['gamepad-input']: GamepadGlobalPanel,
    ['timeline-input']: TimelineGlobalPanel,
    ['video-render']: VideoRenderGlobalPanel,
    ['scene-control']: SceneControlGlobalPanel,
  },
  sketchCollapsible: {
    ['param-presets']: ParamPresetsPanel,
  },
}
