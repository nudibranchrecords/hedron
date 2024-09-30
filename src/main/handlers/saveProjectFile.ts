import { dialog } from 'electron'
import fs from 'fs'
import { SaveProjectResponse } from '../../shared/Events'

export const saveProjectFile = async (
  projectData: string,
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
