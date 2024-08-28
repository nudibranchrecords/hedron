import { SketchEvents } from '../shared/Events'
import { getMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'

export const handleSketchChanges = async (): Promise<void> => {
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init()

  // TODO: Don't fire events while all sketches initially loading
  // We can do this in a nicer way than a timeout
  setTimeout(() => {
    sketchesServer.on('change', (sketchId) => {
      getMainWindow().webContents.send(SketchEvents.RefreshSketch, sketchId)
    })
  }, 1000)

  const url = `http://${host}:${port}`

  getMainWindow().webContents.send(SketchEvents.ServerStart, url)
}
