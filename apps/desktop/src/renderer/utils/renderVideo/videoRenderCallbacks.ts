import { type VideoRenderCallbacks } from '@hedron-gl/video-render'
import { FrameEvents, SaveFrameResponse, SaveFrameSequenceResponse } from '@shared/FrameEvents'

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
    return (await window.electronApi.ipcRenderer.invoke(
      FrameEvents.SaveFrameSequence,
      options,
    )) as SaveFrameSequenceResponse
  },
}
