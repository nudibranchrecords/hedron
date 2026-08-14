import {
  ConfigShot,
  defineOptionNodeConfigs,
  HedronEngine,
  IPlugin,
  OptionNodesFromConfigs,
  ShotNode,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID, getResourceUrl, TimelineInput } from '@hedron-gl/timeline'
import { AudioInput } from '@hedron-gl/audio-input'
import { VIDEO_RENDER_NODE_ID } from './constants'
import { RenderFramesOptions, RenderProgress, VideoRenderCallbacks } from './types'

// Shot-type option nodes aren't covered by `defineOptionNodeConfigs` (typed for ConfigParam only),
// so these are declared directly and passed to `engine.addOptionNodes`.
const CAPTURE_FRAME_SHOT_CONFIG: ConfigShot = {
  nodeType: 'shot',
  key: 'captureFrame',
}

const BROWSE_OUTPUT_DIR_SHOT_CONFIG: ConfigShot = {
  nodeType: 'shot',
  key: 'browseOutputDir',
  title: 'Browse',
}

const RENDER_SHOT_CONFIG: ConfigShot = {
  nodeType: 'shot',
  key: 'render',
  title: 'Render',
}

// Render settings as option nodes (rather than component-local state) so they get the standard
// param UI for free and are persisted with the project via the engine's normal save/load path.
export const VIDEO_RENDER_PARAM_CONFIGS = defineOptionNodeConfigs([
  {
    nodeType: 'param',
    key: 'outputDirAbsolute',
    title: 'Output Directory',
    valueType: 'string',
    defaultValue: '',
  },
  {
    nodeType: 'param',
    key: 'name',
    title: 'Output Name',
    valueType: 'string',
    defaultValue: 'hedron-render',
  },
  {
    nodeType: 'param',
    key: 'createVideo',
    title: 'Create Video',
    valueType: 'boolean',
    defaultValue: true,
  },
  {
    // 0 means "use the current canvas size" (see renderFrames below).
    nodeType: 'param',
    key: 'width',
    title: 'Width',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 3840,
  },
  {
    nodeType: 'param',
    key: 'height',
    title: 'Height',
    valueType: 'number',
    defaultValue: 0,
    sliderMin: 0,
    sliderMax: 2160,
  },
  {
    nodeType: 'param',
    key: 'fps',
    title: 'FPS',
    valueType: 'number',
    defaultValue: 30,
    sliderMin: 1,
    sliderMax: 120,
  },
] as const)

// A mapped type (via Record) rather than a plain interface, so it satisfies useNodeOptionNodes'
// `Record<string, ParamNode | ShotNode | undefined>` generic constraint.
export type VideoRenderOptionNodes = OptionNodesFromConfigs<typeof VIDEO_RENDER_PARAM_CONFIGS> &
  Record<'captureFrame' | 'browseOutputDir' | 'render', ShotNode | undefined>

// Input-less plugin: depends on the timeline plugin (reads duration/audio), but timeline doesn't know about it.
// Electron-specific I/O (files, ffmpeg, dialogs) is injected via the constructor; everything else is engine orchestration here.
export class VideoRenderPlugin implements IPlugin {
  public readonly id = 'video-render'
  public readonly name = 'Video Render'
  public readonly iconName = 'video_camera_back'
  public readonly description = 'Renders the timeline to a frame sequence or video.'

  private engine?: HedronEngine

  constructor(private callbacks: VideoRenderCallbacks) {}

  onEngineInitialize(engine: HedronEngine) {
    this.engine = engine

    engine.addNodeOnce(VIDEO_RENDER_NODE_ID, null, {
      title: 'Video Render',
      key: 'video-render',
      nodeType: 'custom',
      customNodeType: 'video-render',
    })

    engine.addOptionNodes(VIDEO_RENDER_NODE_ID, [
      ...VIDEO_RENDER_PARAM_CONFIGS,
      CAPTURE_FRAME_SHOT_CONFIG,
      BROWSE_OUTPUT_DIR_SHOT_CONFIG,
      RENDER_SHOT_CONFIG,
    ])
  }

  /** Captures the current canvas frame and saves it (a single, timestamped PNG). */
  async captureFrame() {
    const engine = this.requireEngine()
    const dataUrl = engine.captureFrame()

    if (!dataUrl) {
      console.error('Failed to capture frame: No canvas data available')
      return
    }

    const result = await this.callbacks.saveFrame(dataUrl)
    if (result.success) {
      console.log(`Frame saved successfully to: ${result.path}`)
    } else {
      console.error(`Failed to save frame: ${result.error}`)
    }
  }

  /** Renders a frame sequence (and optionally a video) from the timeline, start to finish. */
  async renderFrames(
    {
      frameCount,
      name,
      fps,
      outputDirAbsolute,
      video = false,
      width,
      height,
      audioFileName,
    }: RenderFramesOptions,
    onProgress?: (progress: RenderProgress) => void,
  ) {
    const engine = this.requireEngine()

    // Stop the live loop first - `beginOfflineAnalysis` below has real async gaps, and an
    // unpaused engine would keep advancing the timeline in real time during them.
    engine.pause()

    // Not calling engine.resetTime(): it dumps one huge delta onto the next frame, sending TimelineManager's position deeply negative.
    // The timeline's start position is already reset cleanly via manager.goTo(0) below.

    let originalSize: { width: number; height: number } | null = null
    if (width && height) {
      originalSize = engine.getRendererSize()
      engine.resizeRenderer(width, height)
    }

    const timelinePlugin = engine.getPlugin<TimelineInput>('timeline-input')
    const defaultTimelineManager = timelinePlugin?.timelineManagers.get(DEFAULT_TIMELINE_ID)

    // Precompute the audio's frequency data so audio-reactive params react to the render's own
    // soundtrack (deterministically) instead of whatever the mic happens to be picking up.
    const audioInput = engine.getPlugin<AudioInput>('audio-input')
    let offlineAnalysisActive = false
    if (audioFileName && audioInput && defaultTimelineManager) {
      const audioUrl = getResourceUrl(engine.getStoreState(), audioFileName)
      if (audioUrl) {
        onProgress?.({ stage: 'analyzing-audio' })
        // Deliberately not caught: falling back to live (muted) analysis would silently
        // produce a render with no audio reaction at all.
        await audioInput.beginOfflineAnalysis({
          url: audioUrl,
          fps,
          frameCount,
          getTimeMs: () => defaultTimelineManager.getPosition(),
        })
        offlineAnalysisActive = true
      }
    }

    // Started only now, synchronously followed by renderFramesSequence below (no await between).
    // Muted - audio is muxed in separately. Ignores the live "isPlaying" toggle.
    timelinePlugin?.timelineManagers.forEach((manager) => {
      manager.goTo(0)
      manager.play({ silent: true })
    })

    try {
      await engine.renderFramesSequence(
        frameCount,
        fps,
        async (dataUrl: string, frameIndex: number | string) => {
          const result = await this.callbacks.saveFrame(dataUrl, {
            name,
            frameIndex,
            outputDirAbsolute,
          })
          if (!result.success) {
            console.error(`Failed to save frame ${frameIndex}: ${result.error}`)
          }

          const frameNum = Number(frameIndex)
          if (isNaN(frameNum)) return

          const framesSaved = frameNum + 1
          onProgress?.({ stage: 'rendering-frames', framesSaved, totalFrames: frameCount })

          if (framesSaved % 10 === 0 || framesSaved === frameCount) {
            console.log(`Saved frame ${framesSaved} / ${frameCount}`)
          }
        },
        width,
        height,
      )
    } finally {
      if (offlineAnalysisActive) {
        audioInput?.endOfflineAnalysis()
      }
    }

    this.restoreTimelinePlaybackState(engine, timelinePlugin)

    if (originalSize) {
      engine.restoreRendererSize(originalSize.width, originalSize.height)
    }

    console.log(`Frame sequence saved to ${outputDirAbsolute}/${name}/`)

    if (video) {
      console.log('Creating video...')
      onProgress?.({ stage: 'building-video' })
      const result = await this.callbacks.buildVideo({
        outputDirAbsolute,
        name,
        fps,
        frameCount,
        audioFileName,
      })
      if (result.success && result.videoPath) {
        console.log(`Video created at: ${result.videoPath}`)
        if (audioFileName) {
          console.log(`Video includes audio from: ${audioFileName}`)
        }
      } else {
        console.error(`Failed to create video: ${result.error}`)
      }
    }
  }

  selectOutputDir() {
    return this.callbacks.selectOutputDir()
  }

  // Resumes the timeline's live playback state (as reflected by its `isPlaying` param) after a render
  private restoreTimelinePlaybackState(
    engine: HedronEngine,
    timelinePlugin: TimelineInput | undefined,
  ) {
    timelinePlugin?.timelineManagers.forEach((manager, timelineId) => {
      const isPlayingNode = engine.getNodeOptionNode(timelineId, 'isPlaying')
      manager.pause()
      if (engine.getParamValue(isPlayingNode.id)) {
        manager.goTo(0)
        manager.play()
      }
    })
  }

  private requireEngine(): HedronEngine {
    if (!this.engine) {
      throw new Error('VideoRenderPlugin: engine not initialized yet')
    }
    return this.engine
  }
}
