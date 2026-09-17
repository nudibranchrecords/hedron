import fs from 'fs/promises'
import { getDocumentsPath, getFrameFilePath, getTimestampedFilePath } from './paths'
import { SaveFrameOptions, SaveFrameResponse } from '@shared/FrameEvents'

export async function saveFrameHandler(
  _: unknown,
  base64Data: string,
  options?: SaveFrameOptions,
): Promise<SaveFrameResponse> {
  try {
    const { name, frameIndex, outputDirAbsolute } = options ?? {}

    let filePath: string
    if (name !== undefined && frameIndex !== undefined) {
      filePath = getFrameFilePath(outputDirAbsolute ?? getDocumentsPath(), name, frameIndex)
    } else {
      filePath = getTimestampedFilePath()
    }
    await fs.writeFile(filePath, base64Data, 'base64')
    return { success: true, path: filePath }
  } catch (error) {
    console.error('Error saving frame:', error)
    return { success: false, error: String(error) }
  }
}
