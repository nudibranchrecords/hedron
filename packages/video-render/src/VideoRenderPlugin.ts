import { ConfigShot, HedronEngine, IPlugin, ShotNode } from '@hedron-gl/engine'
import { TimelineInput } from '@hedron-gl/timeline'
import { VIDEO_RENDER_NODE_ID } from './constants'
import { RenderFramesOptions, RenderProgress, VideoRenderCallbacks } from './types'

// Shot-type option nodes aren't covered by `defineOptionNodeConfigs` (typed for ConfigParam only),
// so this is declared directly and passed to `engine.addOptionNodes`.
const CAPTURE_FRAME_SHOT_CONFIG: ConfigShot = {
  nodeType: 'shot',
  key: 'captureFrame',
}

// A mapped type (via Record) rather than a plain interface, so it satisfies useNodeOptionNodes'
// `Record<string, ParamNode | ShotNode | undefined>` generic constraint.
export type VideoRenderOptionNodes = Record<'captureFrame', ShotNode | undefined>

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

    engine.addOptionNodes(VIDEO_RENDER_NODE_ID, [CAPTURE_FRAME_SHOT_CONFIG])
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

    // Not calling engine.resetTime(): it dumps one huge delta onto the next frame, sending TimelineManager's position deeply negative.
    // The timeline's start position is already reset cleanly via manager.goTo(0) below.

    let originalSize: { width: number; height: number } | null = null
    if (width && height) {
      originalSize = engine.getRendererSize()
      engine.resizeRenderer(width, height)
    }

    // Drives the timeline deterministically for the render, muted (audio is muxed in separately).
    // Ignores the live "isPlaying" toggle - a render always plays the full timeline.
    const timelinePlugin = engine.getPlugin<TimelineInput>('timeline-input')
    timelinePlugin?.timelineManagers.forEach((manager) => {
      manager.goTo(0)
      manager.play({ silent: true })
    })

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

    this.restoreTimelinePlaybackState(engine, timelinePlugin)

    if (originalSize) {
      engine.resizeRenderer(originalSize.width, originalSize.height)
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
      if (engine.getParamValue(isPlayingNode.id)) {
        manager.goTo(0)
        manager.play()
      } else {
        manager.pause()
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
