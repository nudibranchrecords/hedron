import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { SaveProjectResponse } from '@shared/Events'
import { ProjectData } from '@shared/types'

const isSubdirectory = (parentDir: string, directory: string) => {
  const resolvedParentDir = path.resolve(parentDir)
  const resolvedDirectory = path.resolve(directory)

  // Check if the directory starts with the parent directory path
  return resolvedDirectory.startsWith(resolvedParentDir + path.sep)
}

const convertPathToRelative = (projectFilePath: string, sketchesDirPath: string) => {
  // skip if sketches dir is already relative
  if (!path.isAbsolute(sketchesDirPath)) return sketchesDirPath

  const parentDir = path.dirname(projectFilePath)

  // Check if the target directory is inside the parent directory
  if (isSubdirectory(parentDir, sketchesDirPath)) {
    // Get the relative path from the parent directory to the target directory
    return path.relative(parentDir, sketchesDirPath)
  }

  // Return absolute if it's not a relative
  return sketchesDirPath
}

export const saveProjectFile = async (
  projectData: ProjectData,
  _savePath: string | null,
): Promise<SaveProjectResponse> => {
  let savePath = _savePath

  if (!savePath) {
    const result = await dialog.showSaveDialog({
      filters: [{ name: 'Project', extensions: ['json'] }],
    })

    if (result.canceled) {
      return {
        result: 'canceled',
      }
    }

    savePath = result.filePath
  }

  projectData.app.sketchesDir = convertPathToRelative(savePath, projectData.app.sketchesDir)

  try {
    const fileContent = JSON.stringify(projectData)

    await fs.writeFileSync(savePath, fileContent, { encoding: 'utf8' })

    return {
      result: 'success',
      savePath,
    }
  } catch (err) {
    console.error('Error saving the project file:', err)
    return { result: 'error', error: 'Failed to save the project file' }
  }
}
