import { HedronEngine } from '@hedron-gl/engine'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { ClockPlugin, ClockGlobalPanel, GlobalClock } from '@hedron-gl/clock'
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

export const engine = new HedronEngine({
  onFrameStart: performanceMonitor.begin,
  onFrameEnd: performanceMonitor.end,
  rendererType: import.meta.env.HEDRON_RENDERER_TYPE ?? 'webgl',
  canvasSizeMode: 'fixedAspectRatio',
})

export const engineStore = engine.getStore()

// Registered first so the clock steps before other plugins update each frame
const clockPlugin = new ClockPlugin()
engine.registerPlugin(clockPlugin)

// For desktop usage it's better to load the entire audio upfront rather than streaming it
const timelineInput = new TimelineInput({ audioLoadingMode: 'preload', clock: clockPlugin.clock })
const audioInput = new AudioInput()

engine.registerPlugin(new MidiInput())
engine.registerPlugin(timelineInput)
engine.registerPlugin(new LFOInput({ clock: clockPlugin.clock }))
engine.registerPlugin(audioInput)
engine.registerPlugin(new GamepadInput())
engine.registerPlugin(new SceneControlPlugin())
engine.registerPlugin(new VideoRenderPlugin(videoRenderCallbacks))
engine.registerPlugin(new ParamPresetsPlugin())

// Routes the timeline's audio stream into the audio-input analyser for live preview.
// Wired here, not in either package, so neither depends on the other.
timelineInput.onAudioSourceChange((source) => {
  audioInput.setLiveStreamSource(source)
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
    ['clock']: ClockGlobalPanel,
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
  widget: {
    ['clock']: GlobalClock,
  },
}
