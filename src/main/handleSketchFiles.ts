import { SketchEvents } from '../shared/Events'
import { sendToMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'
import fs from 'fs'

const getInitialModuleIds = async (dirPath: string): Promise<string[]> => {
  const moduleIds: string[] = []
  const dir = await fs.promises.opendir(dirPath)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      moduleIds.push(dirent.name)
    }
  }

  return moduleIds
}

export const handleSketchFiles = async (dirPath: string): Promise<void> => {
  const moduleIds = await getInitialModuleIds(dirPath)
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init(dirPath)

  sketchesServer.on('change', (sketchId) => {
    console.log(`sketch changed: ${sketchId}`)
    sendToMainWindow(SketchEvents.ReimportSketchModule, sketchId)
  })

  sketchesServer.on('add', (sketchId) => {
    console.log(`sketch added: ${sketchId}`)
  })

  const url = `http://${host}:${port}`

  sendToMainWindow(SketchEvents.ServerStart, url)
  sendToMainWindow(SketchEvents.InitialSketchModuleIds, moduleIds)
}
