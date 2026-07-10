import { VideoRenderCallbacks } from '@hedron-gl/video-render'
import { DialogEvents, OpenOutputDirResponse } from '@shared/Events'
import {
  FrameEvents,
  SaveFrameResponse,
  RenderSequenceOptions,
  SaveFrameSequenceResponse,
} from '@shared/FrameEvents'

export const videoRenderCallbacks: VideoRenderCallbacks = {
  saveFrame: async (dataUrl, options) => {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    return (await window.electronApi.ipcRenderer.invoke(
      FrameEvents.SaveFrame,
      base64Data,
      options,
    )) as SaveFrameResponse
  },

  buildVideo: async (options) => {
    const payload: RenderSequenceOptions = { ...options, video: true }
    return (await window.electronApi.ipcRenderer.invoke(
      FrameEvents.SaveFrameSequence,
      payload,
    )) as SaveFrameSequenceResponse
  },

  selectOutputDir: async () => {
    const result = (await window.electronApi.ipcRenderer.invoke(
      DialogEvents.OpenOutputDirDialog,
    )) as OpenOutputDirResponse
    return result.result === 'success' ? result.outputDirAbsolute : null
  },
}
