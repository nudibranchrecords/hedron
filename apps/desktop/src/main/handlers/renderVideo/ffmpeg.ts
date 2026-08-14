import path from 'path'
import fs from 'fs/promises'
import { execFile } from 'child_process'
import { getCurrentResourcesDir } from '@main/handleResourceFiles'

// Args array (no shell) so filenames/paths containing quotes or shell metacharacters can't
// be interpreted as commands.
function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile('ffmpeg', args, (error, _stdout, stderr) => {
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
    await runFfmpeg([
      '-y',
      '-framerate',
      String(fps),
      '-i',
      framesPattern,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '18',
      // Moves the moov atom to the front - some players/embeds need this to play at all.
      '-movflags',
      '+faststart',
      videoPath,
    ])
    return videoPath
  }

  const resourcesDir = getCurrentResourcesDir()
  if (!resourcesDir) {
    throw new Error('Cannot resolve audio file: no resources directory is currently loaded')
  }
  const audioPath = path.join(resourcesDir, audioFileName)

  const tempAudio = path.join(dirPath, `${name}-temp.wav`)

  // Convert to WAV, trimmed to the video's duration.
  await runFfmpeg([
    '-y',
    '-i',
    audioPath,
    '-t',
    String(videoDuration),
    '-ar',
    '48000',
    '-ac',
    '2',
    tempAudio,
  ])

  await runFfmpeg([
    '-y',
    '-framerate',
    String(fps),
    '-i',
    framesPattern,
    '-i',
    tempAudio,
    '-map',
    '0:v',
    '-map',
    '1:a',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '18',
    // AAC, not PCM: raw PCM-in-MP4 isn't supported by most players, including Windows Media Player.
    // ffmpeg's edit-list metadata also compensates for AAC encoder delay, avoiding a loop-point gap.
    '-c:a',
    'aac',
    '-b:a',
    '320k',
    // Moves the moov atom to the front - some players/embeds need this to play at all.
    '-movflags',
    '+faststart',
    videoPath,
  ])

  await fs
    .unlink(tempAudio)
    .catch((error) => console.error('Failed to clean up temp audio:', error))

  return videoPath
}
