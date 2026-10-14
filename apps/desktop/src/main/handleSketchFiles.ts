import path from 'path'
import fs from 'fs'
import { FileWatchEvents, SketchesServerResponse, SketchEvents } from '@shared/Events'
import { sendToMainWindow } from '@main/mainWindow'
import { SketchesServer } from '@main/SketchesServer/SketchesServer'

// Track the current server instance
let currentSketchesServer: SketchesServer | null = null
let currentSketchesDir: string | null = null

// Caches the resolved absolute source file path (index.ts or index.js) per moduleId.
const sketchSourceFilePaths = new Map<string, string>()

const findSketchSourceFile = (sketchDir: string): string | undefined =>
  ['index.ts', 'index.js'].map((file) => path.join(sketchDir, file)).find((p) => fs.existsSync(p))

const cacheSketchSourceFilePath = (dirPath: string, moduleId: string): boolean => {
  const filePath = findSketchSourceFile(path.join(dirPath, moduleId))
  if (filePath) sketchSourceFilePaths.set(moduleId, filePath)
  return Boolean(filePath)
}

// Falls back to the current sketches dir for modules the server hasn't scanned yet
export const getSketchSourceFilePath = (moduleId: string): string | undefined => {
  const cached = sketchSourceFilePaths.get(moduleId)
  if (cached || !currentSketchesDir) return cached

  // Only direct children of the sketches dir, so a crafted moduleId (e.g. `../`) can't escape it
  const sketchesDir = path.resolve(currentSketchesDir)
  if (path.dirname(path.resolve(sketchesDir, moduleId)) !== sketchesDir) return undefined

  cacheSketchSourceFilePath(sketchesDir, moduleId)
  return sketchSourceFilePaths.get(moduleId)
}

// Look for top level sketch directories and return module IDs (directory names)
const getInitialModuleIds = async (dirPath: string): Promise<string[]> => {
  const moduleIds: string[] = []
  const dir = await fs.promises.opendir(dirPath)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      // Only consider it a sketch module if it has an index.ts or index.js file
      if (cacheSketchSourceFilePath(dirPath, dirent.name)) {
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

  currentSketchesDir = dirPath
  sketchSourceFilePaths.clear()

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
    cacheSketchSourceFilePath(dirPath, moduleId)
    sendToMainWindow(SketchEvents.AddSketchModule, moduleId)
  })

  sketchesServer.on(FileWatchEvents.unlink, (moduleId) => {
    console.log(`sketch module removed: ${moduleId}`)
    sketchSourceFilePaths.delete(moduleId)
    sendToMainWindow(SketchEvents.RemoveSketchModule, moduleId)
  })

  sketchesServer.on(FileWatchEvents.buildResult, (result) => {
    sendToMainWindow(SketchEvents.BuildResult, result)
  })

  const url = `http://${host}:${port}`

  return { url, moduleIds }
}
