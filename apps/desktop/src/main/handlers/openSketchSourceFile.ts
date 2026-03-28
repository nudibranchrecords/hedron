import path from 'path'
import fs from 'fs'
import { shell } from 'electron'

/**
 * Opens the source file (index.ts or index.js) for a sketch module in the default app.
 * @param sketchesDir The absolute path to the sketches directory
 * @param moduleId The sketch's moduleId
 * @returns Promise<{ success: boolean; error?: string }>
 */
export const openSketchSourceFile = async (
  sketchesDir: string,
  moduleId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const tsPath = path.join(sketchesDir, moduleId, 'index.ts')
    const jsPath = path.join(sketchesDir, moduleId, 'index.js')
    let filePath = tsPath
    if (fs.existsSync(tsPath)) {
      filePath = tsPath
    } else if (fs.existsSync(jsPath)) {
      filePath = jsPath
    } else {
      return { success: false, error: 'Source file not found' }
    }
    const openResult = await shell.openPath(filePath)
    if (openResult) {
      return { success: false, error: openResult }
    }
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error opening file',
    }
  }
}
