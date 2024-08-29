import { SketchEvents } from '../shared/Events'
import { refreshSketch } from './engine/sketches'
import { run } from './engine'
import { setSketchesServerUrl } from './engine/globals'

const listen = (event: string, cb: (info: string) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.ServerStart, (sketchesServerUrl) => {
  setSketchesServerUrl(sketchesServerUrl)
  run()
})

listen(SketchEvents.RefreshSketch, (sketchId) => {
  refreshSketch(sketchId)
})
