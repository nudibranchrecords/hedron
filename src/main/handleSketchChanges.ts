import { SketchEvents } from '../shared/Events'
import { getMainWindow } from './mainWindow'
import { SketchesServer } from './SketchesServer'

export const handleSketchChanges = async (): Promise<void> => {
  const sketchesServer = new SketchesServer()

  const { host, port } = await sketchesServer.init()

  sketchesServer.on('change', (sketchId) => {
    console.log(sketchId)
  })

  const url = `http://${host}:${port}`

  getMainWindow().webContents.send(SketchEvents.NewSketch, url)
}
