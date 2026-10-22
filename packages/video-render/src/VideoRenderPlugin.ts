import {
  defineOptionNodeConfigs,
  HedronEngine,
  IPlugin,
  OptionNodesFromConfigs,
  ShotFunc,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID, getResourceUrl, TimelineInput } from '@hedron-gl/timeline'
import { AudioInput } from '@hedron-gl/audio-input'
import { VIDEO_RENDER_NODE_ID } from './constants'
import {
  RenderFramesOptions,
  RenderProgress,
  VideoRenderCallbacks,
  VideoRenderState,
} from './types'

const toEven = (n: number) => Math.ceil(n / 2) * 2

// Render settings as option nodes (rather than component-local state) so they get the standard
// param UI for free and are persisted with the project via the engine's normal save/load path.
export const createVideoRenderOptionNodeConfigs = (actions: {
  captureFrame: ShotFunc
  render: ShotFunc
}) =>
  defineOptionNodeConfigs([
    {
      nodeType: 'param',
      key: 'outputDirAbsolute',
      title: 'Output Directory',
      valueType: 'file',
      fileSource: 'local-directory',
      defaultValue: null,
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
      displayMode: 'field',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 3840,
    },
    {
      nodeType: 'param',
      key: 'height',
      title: 'Height',
      valueType: 'number',
      displayMode: 'field',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 2160,
    },
    {
      nodeType: 'param',
      key: 'fps',
      title: 'FPS',
      valueType: 'number',
      displayMode: 'field',
      defaultValue: 30,
      sliderMin: 1,
      sliderMax: 120,
    },
    {
      // Runs the timeline's last N seconds (uncaptured) before frame 0, so feedback/smoothing state loops seamlessly.
      nodeType: 'param',
      key: 'prewarmSeconds',
      title: 'Prewarm Seconds',
      valueType: 'number',
      displayMode: 'field',
      defaultValue: 0,
      sliderMin: 0,
      sliderMax: 10,
    },
    {
      nodeType: 'shot',
      key: 'captureFrame',
      func: actions.captureFrame,
    },
    {
      nodeType: 'shot',
      key: 'render',
      title: 'Render',
      func: actions.render,
    },
  ])

export type VideoRenderOptionNodes = OptionNodesFromConfigs<
  ReturnType<typeof createVideoRenderOptionNodeConfigs>
>

// Input-less plugin: depends on the timeline plugin (reads duration/audio), but timeline doesn't know about it.
// Electron-specific I/O (files, ffmpeg, dialogs) is injected via the constructor; everything else is engine orchestration here.
export class VideoRenderPlugin implements IPlugin {
  public readonly id = 'video-render'
  public readonly name = 'Video Render'
  public readonly iconName = 'video_camera_back'
  public readonly description = 'Renders the timeline to a frame sequence or video.'

  private engine?: HedronEngine
  private renderState: VideoRenderState = {
    isRendering: false,
    progress: 0,
    status: 'Preparing...',
    error: null,
  }
  private renderListeners = new Set<() => void>()

  public getRenderState = () => this.renderState

  public subscribeToRenderState = (listener: () => void) => {
    this.renderListeners.add(listener)
    return () => {
      this.renderListeners.delete(listener)
    }
  }

  private setRenderState(state: Partial<VideoRenderState>) {
    this.renderState = { ...this.renderState, ...state }
    this.renderListeners.forEach((listener) => listener())
  }

  constructor(private callbacks: VideoRenderCallbacks) {}

  onEngineInitialize(engine: HedronEngine) {
    this.engine = engine

    engine.addNodeOnce(VIDEO_RENDER_NODE_ID, null, {
      title: 'Video Render',
      key: 'video-render',
      nodeType: 'custom',
      customNodeType: 'video-render',
    })

    engine.addOptionNodes(
      VIDEO_RENDER_NODE_ID,
      createVideoRenderOptionNodeConfigs({
        captureFrame: () => this.captureFrame(),
        render: () => this.render(),
      }),
    )
  }

  private getRenderOptions(): RenderFramesOptions {
    const engine = this.requireEngine()
    const state = engine.getStoreState()
    const readValue = (parentId: string, key: string) =>
      state.paramValues[engine.getNodeOptionNode(parentId, key).id]

    const outputDirAbsolute = readValue(VIDEO_RENDER_NODE_ID, 'outputDirAbsolute')
    if (typeof outputDirAbsolute !== 'string' || !outputDirAbsolute) {
      throw new Error('Choose an output directory before rendering')
    }

    const name = readValue(VIDEO_RENDER_NODE_ID, 'name')
    const video = readValue(VIDEO_RENDER_NODE_ID, 'createVideo')
    const width = readValue(VIDEO_RENDER_NODE_ID, 'width')
    const height = readValue(VIDEO_RENDER_NODE_ID, 'height')
    const fps = readValue(VIDEO_RENDER_NODE_ID, 'fps')
    const prewarmSeconds = readValue(VIDEO_RENDER_NODE_ID, 'prewarmSeconds')
    const duration = readValue(DEFAULT_TIMELINE_ID, 'timelineDurationS')
    const audioFileName = readValue(DEFAULT_TIMELINE_ID, 'audioUrl')

    if (
      typeof name !== 'string' ||
      typeof video !== 'boolean' ||
      typeof width !== 'number' ||
      typeof height !== 'number' ||
      typeof fps !== 'number' ||
      typeof prewarmSeconds !== 'number' ||
      typeof duration !== 'number' ||
      (audioFileName !== null && typeof audioFileName !== 'string')
    ) {
      throw new Error('Invalid video render or timeline settings')
    }

    return {
      outputDirAbsolute,
      name,
      video,
      width,
      height,
      fps: fps || 30,
      prewarmSeconds,
      frameCount: Math.max(1, Math.round(duration * (fps || 30))),
      audioFileName: audioFileName ?? undefined,
    }
  }

  private updateRenderProgress = (progress: RenderProgress) => {
    switch (progress.stage) {
      case 'analyzing-audio':
        this.setRenderState({ status: 'Analyzing audio...' })
        break
      case 'prewarming':
        this.setRenderState({
          status: `Prewarming: ${progress.framesDone}/${progress.totalFrames}`,
        })
        break
      case 'rendering-frames':
        this.setRenderState({
          progress: Math.floor((progress.framesSaved / progress.totalFrames) * 100),
          status: `Rendering frames: ${progress.framesSaved}/${progress.totalFrames}`,
        })
        break
      case 'building-video':
        this.setRenderState({ status: 'Creating video file...' })
        break
    }
  }

  /** Triggers a render using the current option-node and timeline values. */
  async render(): Promise<void> {
    if (this.renderState.isRendering) return

    this.setRenderState({
      isRendering: true,
      progress: 0,
      status: 'Preparing to render...',
      error: null,
    })
    try {
      await this.renderFrames(this.getRenderOptions(), this.updateRenderProgress)
      this.setRenderState({ progress: 100, status: 'Render completed!' })
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      this.setRenderState({
        status: 'Render failed',
        error: error instanceof Error ? error.message : 'Video rendering failed',
      })
      throw error
    } finally {
      this.setRenderState({ isRendering: false })
    }
  }

  /** Captures the current canvas frame and saves it (a single, timestamped PNG). */
  async captureFrame() {
    const engine = this.requireEngine()
    const dataUrl = engine.captureFrame()

    if (!dataUrl) {
      throw new Error('Failed to capture frame: No canvas data available')
    }

    const result = await this.callbacks.saveFrame(dataUrl)
    if (result.success) {
      console.log(`Frame saved successfully to: ${result.path}`)
    } else {
      throw new Error(`Failed to save frame: ${result.error}`)
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
      prewarmSeconds = 0,
    }: RenderFramesOptions,
    onProgress?: (progress: RenderProgress) => void,
  ) {
    const engine = this.requireEngine()
    const timelinePlugin = engine.getPlugin<TimelineInput>('timeline-input')
    const defaultTimelineManager = timelinePlugin?.timelineManagers.get(DEFAULT_TIMELINE_ID)

    // Stop the live loop first - `beginOfflineAnalysis` below has real async gaps, and an
    // unpaused engine would keep advancing the timeline in real time during them.
    engine.pause()
    timelinePlugin?.timelineManagers.forEach((manager) => {
      manager.pause()
    })

    // Not calling engine.resetTime(): it dumps one huge delta onto the next frame, sending TimelineManager's position deeply negative.
    // The timeline's start position is already reset cleanly via manager.goTo(0) below.

    // No size set means the canvas pixel size, rounded up to even as libx264 with yuv420p requires
    const originalSize = engine.getRendererSize()
    const useCanvasSize = !width || !height
    const renderWidth = toEven(useCanvasSize ? originalSize.width * originalSize.pixelRatio : width)
    const renderHeight = toEven(
      useCanvasSize ? originalSize.height * originalSize.pixelRatio : height,
    )
    const audioInput = engine.getPlugin<AudioInput>('audio-input')
    let offlineAnalysisActive = false

    try {
      // Pixel ratio 1 so the saved frames exactly match the render size
      engine.resizeRenderer(renderWidth, renderHeight, 1)

      // Precompute the audio's frequency data so audio-reactive params react to the render's own
      // soundtrack (deterministically) instead of whatever the mic happens to be picking up.
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
            getTimeMs: () => defaultTimelineManager.getPositionMs(),
          })
          offlineAnalysisActive = true
        }
      }

      // Each frame advances the timeline before rendering, so the playhead is parked one frame before the
      // frame to render first. Frame k then shows exactly k/fps - the end point (== 0 in a loop) is never rendered.
      const frameMs = 1000 / fps
      const seekBeforeFrame = (frame: number) => {
        timelinePlugin?.timelineManagers.forEach((manager) => {
          if (frame > 0) {
            manager.goTo((frame - 1) * frameMs)
          } else {
            manager.goToBeforeStart(frameMs)
          }
        })
      }

      // Prewarm replays the render's own last frames (same playhead positions and audio rows),
      // so frame 0 inherits the loop end's feedback/smoothing state.
      const prewarmFrameCount = Math.min(frameCount, Math.max(0, Math.round(prewarmSeconds * fps)))
      seekBeforeFrame(prewarmFrameCount > 0 ? frameCount - prewarmFrameCount : 0)

      // Started only now - the engine is paused, so nothing advances until frames are stepped below.
      // Muted - audio is muxed in separately. Ignores the live "isPlaying" toggle.
      timelinePlugin?.timelineManagers.forEach((manager) => manager.play({ silent: true }))

      if (prewarmFrameCount > 0) {
        // Rendered but not captured, so stateful sketches (feedback, smoothing) are warmed up.
        for (let i = 0; i < prewarmFrameCount; i++) {
          engine.advanceFixedFrame(1 / fps)
          onProgress?.({ stage: 'prewarming', framesDone: i + 1, totalFrames: prewarmFrameCount })
          // Yield so the UI stays responsive during long prewarms.
          await new Promise((resolve) => setTimeout(resolve, 1))
        }
        seekBeforeFrame(0)
      }

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
            throw new Error(`Failed to save frame ${frameIndex}: ${result.error}`)
          }

          const frameNum = Number(frameIndex)
          if (isNaN(frameNum)) return

          const framesSaved = frameNum + 1
          onProgress?.({ stage: 'rendering-frames', framesSaved, totalFrames: frameCount })

          if (framesSaved % 10 === 0 || framesSaved === frameCount) {
            console.log(`Saved frame ${framesSaved} / ${frameCount}`)
          }
        },
      )
    } finally {
      if (offlineAnalysisActive) {
        audioInput?.endOfflineAnalysis()
      }
      engine.resizeRenderer(originalSize.width, originalSize.height, originalSize.pixelRatio)

      engine.resume()
      timelinePlugin?.timelineManagers.forEach((manager, timelineId) => {
        const isPlayingNode = engine.getNodeOptionNode(timelineId, 'isPlaying')
        manager.pause()
        // Set state param so playback doesn't continue after rendering is complete (in case was playing before)
        engine.setParamValue(isPlayingNode.id, false)
      })
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
        throw new Error(`Failed to create video: ${result.error}`)
      }
    }
  }

  private requireEngine(): HedronEngine {
    if (!this.engine) {
      throw new Error('VideoRenderPlugin: engine not initialized yet')
    }
    return this.engine
  }
}
