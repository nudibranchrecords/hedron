import path from 'path'
import fs, { mkdirSync, existsSync } from 'fs'
import { exec } from 'child_process'
import { app } from 'electron'
import { SaveFrameResponse } from '@shared/FrameEvents'

function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath)
  }
}

function getDocumentsPath() {
  return app.getPath('documents')
}

function getFrameDirPath(name: string) {
  const dirPath = path.join(getDocumentsPath(), name)
  ensureDir(dirPath)
  return dirPath
}

function getFrameFilePath(name: string, frameIndex: number | string) {
  return path.join(getFrameDirPath(name), `${name}-${frameIndex}.png`)
}

function getTimestampedFilePath() {
  const documentsPath = getDocumentsPath()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `hedron-${timestamp}.png`
  return path.join(documentsPath, filename)
}

export async function saveFrameHandler(
  _: unknown,
  base64Data: string,
  name?: string,
  frameIndex?: number | string,
): Promise<SaveFrameResponse> {
  try {
    let filePath: string
    if (name !== undefined && frameIndex !== undefined) {
      filePath = getFrameFilePath(name, frameIndex)
    } else {
      filePath = getTimestampedFilePath()
    }
    fs.writeFileSync(filePath, base64Data, 'base64')
    return { success: true, path: filePath }
  } catch (error) {
    console.error('Error saving frame:', error)
    return { success: false, error: String(error) }
  }
}

export async function saveFrameSequenceHandler(
  _: unknown,
  base64Array: string[],
  name: string,
  video: boolean = false,
  audioPath?: string,
  frameCount: number = 0,
) {
  try {
    const dirPath = getFrameDirPath(name)
    if (frameCount === 0) {
      frameCount = base64Array.length
    }
    // Padding numbers with 0s based on frame count
    const padding = frameCount > 0 ? String(frameCount - 1).length : 1
    const paddedFormat = `%0${padding}d`

    if (base64Array && base64Array.length > 0) {
      for (let i = 0; i < base64Array.length; i++) {
        const paddedIndex = String(i).padStart(padding, '0')
        const filePath = path.join(dirPath, `${name}-${paddedIndex}.png`)
        fs.writeFileSync(filePath, base64Array[i], 'base64')
      }
    }

    let videoPath: string | undefined = undefined
    if (video) {
      const frameRate = 30
      const videoDuration = frameCount / frameRate

      console.log(`Creating video with duration: ${videoDuration} seconds`)
      videoPath = path.join(dirPath, `${name}.mp4`)

      let ffmpegCmd: string
      if (!audioPath) {
        ffmpegCmd = `ffmpeg -y -framerate ${frameRate} -i "${dirPath}/${name}-${paddedFormat}.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${videoPath}"`
      } else {
        const tempAudio = path.join(dirPath, `${name}-temp.wav`)

        // First create a temporary audio file trimmed to exact length
        await new Promise<void>((resolve, reject) => {
          // Convert to WAV and trim to exact duration, adding fade in/out
          const audioCmd = `ffmpeg -y -i "${path.join(getDocumentsPath(), audioPath)}" -t ${videoDuration} -af "afade=t=in:st=0:d=0.5,afade=t=out:st=${videoDuration - 0.5}:d=0.5" -ar 48000 -ac 2 "${tempAudio}"`
          exec(audioCmd, (error, _stdout, stderr) => {
            if (error) {
              console.error('ffmpeg audio error:', error, stderr)
              reject(error)
            } else {
              resolve()
            }
          })
        })

        // Then combine video and trimmed audio
        ffmpegCmd = `ffmpeg -y -framerate ${frameRate} -i "${dirPath}/${name}-${paddedFormat}.png" -i "${tempAudio}" -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a pcm_s16le "${videoPath}"`
        console.log('FFmpeg command:', ffmpegCmd)

        // Execute the video creation command
        await new Promise<void>((resolve, reject) => {
          exec(ffmpegCmd, (error, _stdout, stderr) => {
            if (error) {
              console.error('ffmpeg error:', error, stderr)
              reject(error)
            } else {
              resolve()
            }
          })
        })

        // Clean up temp file
        try {
          // fs.unlinkSync(tempAudio)
        } catch (e) {
          console.error('Error cleaning up temp audio file:', e)
        }
      }

      if (!audioPath) {
        await new Promise<void>((resolve, reject) => {
          exec(ffmpegCmd, (error, _stdout, stderr) => {
            if (error) {
              console.error('ffmpeg error:', error, stderr)
              reject(error)
            } else {
              resolve()
            }
          })
        })
      }
    }
    return { success: true, path: dirPath, videoPath }
  } catch (error) {
    console.error('Error saving frame sequence:', error)
    return { success: false, error: String(error) }
  }
}
