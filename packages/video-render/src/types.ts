export interface RenderFramesOptions {
  frameCount: number
  name: string
  fps: number
  outputDirAbsolute: string
  video?: boolean
  width?: number
  height?: number
  /** Resource filename (not an absolute path) of the audio to mux in. */
  audioFileName?: string
}

export interface SaveFrameOptions {
  name?: string
  frameIndex?: number | string
  outputDirAbsolute?: string
}

export interface SaveFrameResult {
  success: boolean
  path?: string
  error?: string
}

export interface BuildVideoOptions {
  outputDirAbsolute: string
  name: string
  fps: number
  frameCount: number
  /** Resource filename (not an absolute path) of the audio to mux in. */
  audioFileName?: string
}

export interface BuildVideoResult {
  success: boolean
  path?: string
  videoPath?: string
  error?: string
}

/**
 * This package never touches fs/ffmpeg/IPC directly; only this platform-specific I/O is injected.
 * Everything else (engine orchestration, timeline sync, resizing) lives in VideoRenderPlugin itself.
 */
export interface VideoRenderCallbacks {
  saveFrame: (dataUrl: string, options?: SaveFrameOptions) => Promise<SaveFrameResult>
  buildVideo: (options: BuildVideoOptions) => Promise<BuildVideoResult>
  /** Prompts the user to choose an output directory, resolving to its absolute path, or null if canceled. */
  selectOutputDir: () => Promise<string | null>
}
