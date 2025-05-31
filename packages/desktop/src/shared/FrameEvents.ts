// Events for frame capture functionality
export enum FrameEvents {
  SaveFrame = 'save-frame',
  SaveFrameSequence = 'save-frame-sequence',
}

export interface SaveFrameResponse {
  success: boolean
  path?: string
  error?: string
}

export interface SaveFrameSequenceResponse {
  success: boolean
  path?: string
  videoPath?: string
  error?: string
}
