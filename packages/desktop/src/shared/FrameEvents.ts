// Events for frame capture functionality
export enum FrameEvents {
  SaveFrame = 'save-frame',
}

export interface SaveFrameResponse {
  success: boolean
  path?: string
  error?: string
}
