import { dialog } from 'electron'
import fs from 'fs'

export const saveProjectFile = async (projectData: string) => {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'Poject', extensions: ['json'] }],
  })

  const projectFile = result.filePath

  const fileContent = JSON.stringify(projectData)

  await fs.writeFileSync(projectFile, fileContent, { encoding: 'utf8' })
}
