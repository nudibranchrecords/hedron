import path from 'path'
import { exec } from 'child_process'
import { getCurrentResourcesDir } from '@main/handleResourceFiles'

function runFfmpeg(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, _stdout, stderr) => {
      if (error) {
        console.error('ffmpeg error:', error, stderr)
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

interface BuildVideoOptions {
  dirPath: string
  name: string
  fps: number
  frameCount: number
  audioFileName?: string
}

/**
 * Builds an mp4 from a directory of zero-padded PNG frames (as written by HedronEngine.renderFramesSequence
 * via repeated saveFrameHandler calls), optionally muxing in audio resolved from the current resources directory.
 */
export async function buildVideoFromFrames({
  dirPath,
  name,
  fps,
  frameCount,
  audioFileName,
}: BuildVideoOptions): Promise<string> {
  const videoDuration = frameCount / fps
  const videoPath = path.join(dirPath, `${name}.mp4`)

  // Frame filenames are zero-padded to match HedronEngine.renderFramesSequence's padding exactly
  const padding = frameCount.toString().length
  const framesPattern = path.join(dirPath, `${name}-%0${padding}d.png`)

  if (!audioFileName) {
    await runFfmpeg(
      `ffmpeg -y -framerate ${fps} -i "${framesPattern}" -c:v libx264 -pix_fmt yuv420p -crf 18 "${videoPath}"`,
    )
    return videoPath
  }

  const resourcesDir = getCurrentResourcesDir()
  if (!resourcesDir) {
    throw new Error('Cannot resolve audio file: no resources directory is currently loaded')
  }
  const audioPath = path.join(resourcesDir, audioFileName)

  const tempAudio = path.join(dirPath, `${name}-temp.wav`)

  // Convert to WAV and trim to exact duration, adding fade in/out
  await runFfmpeg(
    `ffmpeg -y -i "${audioPath}" -t ${videoDuration} -af "afade=t=in:st=0:d=0.5,afade=t=out:st=${videoDuration - 0.5}:d=0.5" -ar 48000 -ac 2 "${tempAudio}"`,
  )

  await runFfmpeg(
    `ffmpeg -y -framerate ${fps} -i "${framesPattern}" -i "${tempAudio}" -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a pcm_s16le "${videoPath}"`,
  )

  return videoPath
}
