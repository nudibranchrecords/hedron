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

function getFrameFilePath(name: string, frameIndex: number) {
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
  frameIndex?: number,
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
) {
  try {
    const dirPath = getFrameDirPath(name)
    if (base64Array && base64Array.length > 0) {
      for (let i = 0; i < base64Array.length; i++) {
        const filePath = path.join(dirPath, `${name}-${i}.png`)
        fs.writeFileSync(filePath, base64Array[i], 'base64')
      }
    }
    let videoPath: string | undefined = undefined
    if (video) {
      videoPath = path.join(dirPath, `${name}.mp4`)
      const ffmpegCmd = `ffmpeg -y -framerate 30 -i "${dirPath}/${name}-%d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${videoPath}"`
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
    return { success: true, path: dirPath, videoPath }
  } catch (error) {
    console.error('Error saving frame sequence:', error)
    return { success: false, error: String(error) }
  }
}
