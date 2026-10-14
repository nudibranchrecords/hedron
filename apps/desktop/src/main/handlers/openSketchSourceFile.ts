import { shell } from 'electron'
import { getSketchSourceFilePath } from '@main/handleSketchFiles'

/**
 * Opens the source file (index.ts or index.js) for a sketch module in the default app.
 * @param moduleId The sketch's moduleId
 */
export const openSketchSourceFile = async (
  moduleId: string,
): Promise<{ success: boolean; error?: string }> => {
  const filePath = getSketchSourceFilePath(moduleId)
  if (!filePath) return { success: false, error: 'Source file not found' }

  const openError = await shell.openPath(filePath)
  return openError ? { success: false, error: openError } : { success: true }
}
