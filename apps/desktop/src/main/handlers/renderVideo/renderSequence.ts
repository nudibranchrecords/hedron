import { getFrameDirPath } from './paths'
import { buildVideoFromFrames } from './ffmpeg'
import { RenderSequenceOptions, SaveFrameSequenceResponse } from '@shared/FrameEvents'

// By the time this is called, all frames have already been written individually via saveFrameHandler
// (FrameEvents.SaveFrame). This just finalizes the render into a video, if requested.
export async function saveFrameSequenceHandler(
  _: unknown,
  options: RenderSequenceOptions,
): Promise<SaveFrameSequenceResponse> {
  try {
    const { outputDirAbsolute, name, video, fps, frameCount, audioFileName } = options
    const dirPath = getFrameDirPath(outputDirAbsolute, name)

    if (!video) {
      return { success: true, path: dirPath }
    }

    const videoPath = await buildVideoFromFrames({ dirPath, name, fps, frameCount, audioFileName })

    return { success: true, path: dirPath, videoPath }
  } catch (error) {
    console.error('Error saving frame sequence:', error)
    return { success: false, error: String(error) }
  }
}
