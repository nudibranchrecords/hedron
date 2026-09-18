import path from 'path'
import fs from 'fs'
import { shell } from 'electron'
import { getCachedSketchSourceFilePath } from '@main/handleSketchFiles'

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
    let filePath = getCachedSketchSourceFilePath(moduleId)

    if (!filePath) {
      // Not cached (e.g. sketches server hasn't scanned this module yet) - resolve it directly,
      // guarding against a crafted moduleId escaping sketchesDir (e.g. via `../`).
      const sketchDir = path.join(sketchesDir, moduleId)
      const resolvedSketchesDir = path.resolve(sketchesDir)
      const resolvedSketchDir = path.resolve(sketchDir)
      if (
        resolvedSketchDir !== resolvedSketchesDir &&
        !resolvedSketchDir.startsWith(resolvedSketchesDir + path.sep)
      ) {
        return { success: false, error: 'Invalid sketch module id' }
      }

      const tsPath = path.join(sketchDir, 'index.ts')
      const jsPath = path.join(sketchDir, 'index.js')
      if (fs.existsSync(tsPath)) {
        filePath = tsPath
      } else if (fs.existsSync(jsPath)) {
        filePath = jsPath
      } else {
        return { success: false, error: 'Source file not found' }
      }
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
