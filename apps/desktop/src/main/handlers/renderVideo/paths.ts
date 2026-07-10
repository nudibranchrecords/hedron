import path from 'path'
import { mkdirSync, existsSync } from 'fs'
import { app } from 'electron'

export function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}

export function getDocumentsPath() {
  return app.getPath('documents')
}

export function getFrameDirPath(baseDir: string, name: string) {
  const dirPath = path.join(baseDir, name)
  ensureDir(dirPath)
  return dirPath
}

export function getFrameFilePath(baseDir: string, name: string, frameIndex: number | string) {
  return path.join(getFrameDirPath(baseDir, name), `${name}-${frameIndex}.png`)
}

export function getTimestampedFilePath() {
  const documentsPath = getDocumentsPath()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `hedron-${timestamp}.png`
  return path.join(documentsPath, filename)
}
