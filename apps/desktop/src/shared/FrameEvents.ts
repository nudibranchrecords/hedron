// Events for frame capture functionality
export enum FrameEvents {
  SaveFrame = 'save-frame',
  SaveFrameSequence = 'save-frame-sequence',
}

export interface SaveFrameOptions {
  name?: string
  frameIndex?: number | string
  /** Base output directory. Defaults to the Documents folder when omitted. */
  outputDirAbsolute?: string
}

export interface SaveFrameResponse {
  success: boolean
  path?: string
  error?: string
}

export interface RenderSequenceOptions {
  outputDirAbsolute: string
  name: string
  video: boolean
  fps: number
  frameCount: number
  /** Resource filename (not an absolute path) of the audio to mux in, resolved against the current resources directory. */
  audioFileName?: string
}

export interface SaveFrameSequenceResponse {
  success: boolean
  path?: string
  videoPath?: string
  error?: string
}
