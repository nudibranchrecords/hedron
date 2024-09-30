import { FileWatchEvents, SketchesServerResponse, SketchEvents } from '../shared/Events'
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

export const startSketchesServer = async (dirPath: string): Promise<SketchesServerResponse> => {
  const moduleIds = await getInitialModuleIds(dirPath)
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init(dirPath)

  sketchesServer.on(FileWatchEvents.change, (moduleId) => {
    console.log(`sketch module changed: ${moduleId}`)
    sendToMainWindow(SketchEvents.ReimportSketchModule, moduleId)
  })

  sketchesServer.on(FileWatchEvents.add, (moduleId) => {
    console.log(`sketch module added: ${moduleId}`)
    sendToMainWindow(SketchEvents.AddSketchModule, moduleId)
  })

  sketchesServer.on(FileWatchEvents.unlink, (moduleId) => {
    console.log(`sketch module removed: ${moduleId}`)
    sendToMainWindow(SketchEvents.RemoveSketchModule, moduleId)
  })

  const url = `http://${host}:${port}`

  return { url, moduleIds }
}
