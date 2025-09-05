export type Result<T> =
  | { success: true; data: T; error: undefined }
  | { success: false; error: string; data: undefined }

export type RendererType = 'webgl' | 'webgpu'

export type CanvasSizeMode = 'fixedAspectRatio' | 'fillContainer'
