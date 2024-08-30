import { SketchEvents } from '../shared/Events'
import { getMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'

export const handleSketchChanges = async (): Promise<void> => {
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init()

  sketchesServer.on('change', (sketchId) => {
    console.log(`sketch changed: ${sketchId}`)
    getMainWindow().webContents.send(SketchEvents.RefreshSketch, sketchId)
  })

  sketchesServer.on('add', (sketchId) => {
    console.log(`sketch added: ${sketchId}`)
    // getMainWindow().webContents.send(SketchEvents.RefreshSketch, sketchId)
  })

  const url = `http://${host}:${port}`

  const startSketches = (): void => {
    getMainWindow().webContents.send(SketchEvents.ServerStart, url)
  }

  getMainWindow().webContents.on('did-finish-load', () => {
    startSketches()
  })
}
