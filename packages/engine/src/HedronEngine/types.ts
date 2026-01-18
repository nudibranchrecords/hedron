export type Result<T> =
  | { success: true; data: T; error: undefined }
  | { success: false; error: string; data: undefined }

export type RendererType = 'webgl' | 'webgpu'

export type CanvasSizeMode = 'fixedAspectRatio' | 'fillContainer'

export type ShotArgsObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
