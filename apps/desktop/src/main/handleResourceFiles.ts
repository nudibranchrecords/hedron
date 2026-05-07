import fs from 'fs'
import { FileWatchEvents, ResourceEvents, ResourcesServerResponse } from '@shared/Events'
import { sendToMainWindow } from '@main/mainWindow'
import { ResourcesServer } from '@main/ResourcesServer/ResourcesServer'

// Track the current server instance
let currentResourcesServer: ResourcesServer | null = null

const getInitialFileNames = async (dirPath: string): Promise<string[]> => {
  const fileNames: string[] = []
  const dir = await fs.promises.opendir(dirPath)
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      fileNames.push(dirent.name)
    }
  }
  return fileNames
}

export const startResourcesServer = async (dirPath: string): Promise<ResourcesServerResponse> => {
  // Shutdown any existing server before starting a new one
  if (currentResourcesServer) {
    console.log('[HEDRON] Shutting down existing resources server')
    await currentResourcesServer.shutdown()
    currentResourcesServer = null
  }

  // If the resources directory doesn't exist, return an empty response with no server
  try {
    const stats = fs.statSync(dirPath)
    if (!stats.isDirectory()) {
      console.warn(`[HEDRON] Resources path exists but is not a directory: ${dirPath}`)
      return { url: null, fileNames: [] }
    }
  } catch {
    console.warn(`[HEDRON] Resources path does not exist: ${dirPath}`)
    return { url: null, fileNames: [] }
  }

  const fileNames = await getInitialFileNames(dirPath)
  const resourcesServer = new ResourcesServer()
  currentResourcesServer = resourcesServer

  console.log(`[HEDRON] Starting resources server with directory: ${dirPath}`)

  const { host, port } = await resourcesServer.init(dirPath)

  console.log(`[HEDRON] Resources server started at http://${host}:${port}`)

  resourcesServer.on(FileWatchEvents.add, (fileName: string) => {
    console.log(`resource file added: ${fileName}`)
    sendToMainWindow(ResourceEvents.AddResourceFile, fileName)
  })

  resourcesServer.on(FileWatchEvents.unlink, (fileName: string) => {
    console.log(`resource file removed: ${fileName}`)
    sendToMainWindow(ResourceEvents.RemoveResourceFile, fileName)
  })

  resourcesServer.on(FileWatchEvents.change, (fileName: string) => {
    console.log(`resource file changed: ${fileName}`)
    sendToMainWindow(ResourceEvents.ChangeResourceFile, fileName)
  })

  const url = `http://${host}:${port}`

  return { url, fileNames }
}
