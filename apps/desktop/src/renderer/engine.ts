import { HedronEngine, IPlugin } from '@hedron-gl/engine'
import type { PluginViews } from '@hedron-gl/plugin-sdk'
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
import { registerPluginViews } from '@renderer/plugins/pluginViews'
import { registerSharedModules } from '@renderer/plugins/sharedModules'

export const performanceMonitor = new Stats()

export const engine = new HedronEngine({
  onFrameStart: performanceMonitor.begin,
  onFrameEnd: performanceMonitor.end,
  rendererType: import.meta.env.HEDRON_RENDERER_TYPE ?? 'webgl',
  canvasSizeMode: 'fixedAspectRatio',
})

export const engineStore = engine.getStore()

registerSharedModules()

// Built-in plugins go through the same view registry as runtime-loaded ones
const registerBuiltIn = (plugin: IPlugin, views?: PluginViews) => {
  engine.registerPlugin(plugin)
  registerPluginViews(plugin.id, views)
}

// Registered first so the clock steps before other plugins update each frame
const clockPlugin = new ClockPlugin()
registerBuiltIn(clockPlugin, { globalPanel: ClockGlobalPanel, widget: GlobalClock })

// For desktop usage it's better to load the entire audio upfront rather than streaming it
const timelineInput = new TimelineInput({ audioLoadingMode: 'preload', clock: clockPlugin.clock })
const audioInput = new AudioInput()

registerBuiltIn(new MidiInput(), {
  globalPanel: MidiGlobalPanel,
  inputPanel: { midi: MidiInputPanel },
})
registerBuiltIn(timelineInput, {
  globalPanel: TimelineGlobalPanel,
  inputPanel: { ['timeline-track']: TimelineInputPanel },
})
registerBuiltIn(new LFOInput({ clock: clockPlugin.clock }), { inputPanel: { lfo: LFOInputPanel } })
registerBuiltIn(audioInput, {
  globalPanel: AudioGlobalPanel,
  inputPanel: { audio: AudioInputPanel },
})
registerBuiltIn(new GamepadInput(), {
  globalPanel: GamepadGlobalPanel,
  inputPanel: { gamepad: GamepadInputPanel },
})
registerBuiltIn(new SceneControlPlugin(), { globalPanel: SceneControlGlobalPanel })
registerBuiltIn(new VideoRenderPlugin(videoRenderCallbacks), {
  globalPanel: VideoRenderGlobalPanel,
})
registerBuiltIn(new ParamPresetsPlugin(), { sketchCollapsible: ParamPresetsPanel })

// Routes the timeline's audio stream into the audio-input analyser for live preview.
// Wired here, not in either package, so neither depends on the other.
timelineInput.onAudioSourceChange((source) => {
  audioInput.setLiveStreamSource(source)
})
