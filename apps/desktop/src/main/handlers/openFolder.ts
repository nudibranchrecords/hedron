import path from 'path'
import fs from 'fs'
import { shell } from 'electron'

/**
 * Opens a folder in the user's default file browser
 * @param folderPath The path of the folder to open
 * @returns Object indicating success or error
 */
export const openFolder = async (
  folderPath: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Normalize the path to handle any inconsistencies
    let normalizedPath = path.normalize(folderPath)

    if (!fs.existsSync(normalizedPath)) {
      return { success: false, error: 'Folder does not exist' }
    }

    // Ensure the path is a directory; if it's a file, get its parent directory
    const stats = fs.statSync(normalizedPath)
    if (!stats.isDirectory()) {
      normalizedPath = path.dirname(normalizedPath)
    }

    // Open the folder in the default file browser
    const openResult = await shell.openPath(normalizedPath)
    if (openResult) {
      // Electron's shell.openPath returns a non-empty string on error
      return { success: false, error: openResult }
    }
    return { success: true }
  } catch (err) {
    console.error('Error opening folder:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error opening folder',
    }
  }
}
