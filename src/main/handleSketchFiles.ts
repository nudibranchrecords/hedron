import { SketchEvents } from '../shared/Events'
import { getMainWindow, sendToMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'
import fs from 'fs'
import { userSettings } from './userSettings'

const getInitialSketchIds = async (): Promise<string[]> => {
  const sketchIds: string[] = []
  const dir = await fs.promises.opendir(userSettings.sketchesDir)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      sketchIds.push(dirent.name)
    }
  }

  return sketchIds
}

export const handleSketchFiles = async (): Promise<void> => {
  const sketchIds = await getInitialSketchIds()
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init()

  sketchesServer.on('change', (sketchId) => {
    console.log(`sketch changed: ${sketchId}`)
    sendToMainWindow(SketchEvents.RefreshSketch, sketchId)
  })

  sketchesServer.on('add', (sketchId) => {
    console.log(`sketch added: ${sketchId}`)
    // sendToMainWindow(SketchEvents.RefreshSketch, sketchId)
  })

  const url = `http://${host}:${port}`

  getMainWindow().webContents.on('did-finish-load', () => {
    sendToMainWindow(SketchEvents.ServerStart, url)
    sendToMainWindow(SketchEvents.InitialSketchLibraryIds, sketchIds)
  })
}
