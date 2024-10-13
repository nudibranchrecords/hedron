import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { OpenProjectResponse } from '../../shared/Events'
import { ProjectData } from '../../shared/types'

export const openProjectFile = async (projectPath?: string): Promise<OpenProjectResponse> => {
  if (!projectPath) {
    const result = await dialog.showOpenDialog({
      filters: [{ name: 'Project', extensions: ['json'] }],
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { result: 'canceled' }
    }

    projectPath = result.filePaths[0]
  }

  try {
    // Read and parse the JSON from the project file
    const fileContent = fs.readFileSync(projectPath, { encoding: 'utf8' })
    const projectData = JSON.parse(fileContent) as ProjectData

    // Get the directory of the project file
    const projectDir = path.dirname(projectPath)

    // Find sketches dir from project data (will work with rel or abs path)
    const sketchesDirAbsolute = path.resolve(projectDir, projectData.app.sketchesDir)

    try {
      const stats = fs.statSync(sketchesDirAbsolute)
      if (!stats.isDirectory()) {
        return {
          result: 'error',
          error: 'Could not find associated sketches folder for project',
        }
      }
    } catch (err) {
      console.error(err)
      return { result: 'error', error: 'Could not find associated sketches folder for project' }
    }

    // Return both the JSON data and the sketches directory path (if it exists)
    return {
      result: 'success',
      projectData,
      sketchesDirAbsolute,
      savePath: projectPath,
    }
  } catch (err) {
    console.error('Error reading or parsing the project file:', err)
    return { result: 'error', error: 'Failed to read or parse the project file' }
  }
}
