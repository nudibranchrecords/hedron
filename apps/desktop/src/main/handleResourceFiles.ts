import fs from 'fs'
import path from 'path'
import { Resource } from '@hedron-gl/engine'
import { getContentTypeFromFileName } from '@utils/getContentTypeFromFileName'
import { FileWatchEvents, ResourceEvents, ResourcesServerResponse } from '@shared/Events'
import { sendToMainWindow } from '@main/mainWindow'
import { ResourcesServer } from '@main/ResourcesServer/ResourcesServer'

// Track the current server instance
let currentResourcesServer: ResourcesServer | null = null

const getInitialFiles = async (dirPath: string): Promise<Record<string, Resource>> => {
  const files: Record<string, Resource> = {}
  const dir = await fs.promises.opendir(dirPath)
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      const filePath = path.join(dirPath, dirent.name)
      const stats = await fs.promises.stat(filePath)
      files[dirent.name] = {
        fileName: dirent.name,
        contentType: getContentTypeFromFileName(dirent.name),
        lastModified: stats.mtimeMs,
      }
    }
  }
  return files
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
      return { url: null, files: {} }
    }
  } catch {
    console.warn(`[HEDRON] Resources path does not exist: ${dirPath}`)
    return { url: null, files: {} }
  }

  const files = await getInitialFiles(dirPath)
  const resourcesServer = new ResourcesServer()
  currentResourcesServer = resourcesServer

  console.log(`[HEDRON] Starting resources server with directory: ${dirPath}`)

  const { host, port } = await resourcesServer.init(dirPath)

  console.log(`[HEDRON] Resources server started at http://${host}:${port}`)

  resourcesServer.on(FileWatchEvents.add, ({ fileName, lastModified }: Resource) => {
    const contentType = getContentTypeFromFileName(fileName)
    console.log(`resource file added: ${fileName} with content type: ${contentType}`)
    sendToMainWindow(ResourceEvents.AddResourceFile, [fileName, contentType, lastModified])
  })

  resourcesServer.on(FileWatchEvents.unlink, (fileName: string) => {
    console.log(`resource file removed: ${fileName}`)
    sendToMainWindow(ResourceEvents.RemoveResourceFile, fileName)
  })

  resourcesServer.on(FileWatchEvents.change, ({ fileName, lastModified }: Resource) => {
    const contentType = getContentTypeFromFileName(fileName)
    console.log(`resource file changed: ${fileName}`)
    sendToMainWindow(ResourceEvents.ChangeResourceFile, [fileName, contentType, lastModified])
  })

  const url = `http://${host}:${port}`

  return { url, files }
}
