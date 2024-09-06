import { SketchEvents } from '../shared/Events'
import { getMainWindow, sendToMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'
import fs from 'fs'
import { userSettings } from './userSettings'

const getInitialModuleIds = async (): Promise<string[]> => {
  const moduleIds: string[] = []
  const dir = await fs.promises.opendir(userSettings.sketchesDir)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      moduleIds.push(dirent.name)
    }
  }

  return moduleIds
}

export const handleSketchFiles = async (): Promise<void> => {
  const moduleIds = await getInitialModuleIds()
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init()

  sketchesServer.on('change', (sketchId) => {
    console.log(`sketch changed: ${sketchId}`)
    sendToMainWindow(SketchEvents.ReimportSketchModule, sketchId)
  })

  sketchesServer.on('add', (sketchId) => {
    console.log(`sketch added: ${sketchId}`)
  })

  const url = `http://${host}:${port}`

  getMainWindow().webContents.on('did-finish-load', () => {
    sendToMainWindow(SketchEvents.ServerStart, url)
    sendToMainWindow(SketchEvents.InitialSketchModuleIds, moduleIds)
  })
}
