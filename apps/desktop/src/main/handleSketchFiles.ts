import fs from 'fs'
import { FileWatchEvents, SketchesServerResponse, SketchEvents } from '@shared/Events'
import { sendToMainWindow } from '@main/mainWindow'
import { SketchesServer } from '@main/SketchesServer/SketchesServer'

// Track the current server instance
let currentSketchesServer: SketchesServer | null = null

// Look for top level sketch directories and return module IDs (directory names)
const getInitialModuleIds = async (dirPath: string): Promise<string[]> => {
  const moduleIds: string[] = []
  const dir = await fs.promises.opendir(dirPath)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const subdir = `${dirPath}/${dirent.name}`
      const hasIndexTs = fs.existsSync(`${subdir}/index.ts`)
      const hasIndexJs = fs.existsSync(`${subdir}/index.js`)
      // Only consider it a sketch module if it has an index.ts or index.js file
      if (hasIndexTs || hasIndexJs) {
        moduleIds.push(dirent.name)
      }
    }
  }
  return moduleIds
}

export const startSketchesServer = async (dirPath: string): Promise<SketchesServerResponse> => {
  // Shutdown any existing server before starting a new one
  if (currentSketchesServer) {
    console.log('[HEDRON] Shutting down existing sketches server')
    await currentSketchesServer.shutdown()
    currentSketchesServer = null
  }

  const moduleIds = await getInitialModuleIds(dirPath)
  const sketchesServer = new SketchesServer()
  currentSketchesServer = sketchesServer

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

  sketchesServer.on(FileWatchEvents.buildResult, (result) => {
    sendToMainWindow(SketchEvents.BuildResult, result)
  })

  const url = `http://${host}:${port}`

  return { url, moduleIds }
}
