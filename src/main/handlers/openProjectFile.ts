import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { OpenProjectResponse } from '../../shared/Events'

export const openProjectFile = async (): Promise<OpenProjectResponse> => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'Project', extensions: ['json'] }],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { result: 'canceled' }
  }

  try {
    const projectFile = result.filePaths[0]

    // Read and parse the JSON from the project file
    const fileContent = fs.readFileSync(projectFile, { encoding: 'utf8' })
    const projectData = JSON.parse(fileContent)

    // Get the directory of the project file
    const projectDir = path.dirname(projectFile)

    // Path to the neighboring 'sketches' directory
    const sketchesDir = path.join(projectDir, 'sketches')

    try {
      const stats = fs.statSync(sketchesDir)
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
      sketchesDirPath: sketchesDir,
      savePath: projectFile,
    }
  } catch (err) {
    console.error('Error reading or parsing the project file:', err)
    return { result: 'error', error: 'Failed to read or parse the project file' }
  }
}
