import { SketchEvents } from '../shared/Events'
import { refreshSketch } from './engine/sketches'
import { run } from './engine'
import { setSketchesServerUrl } from './engine/globals'
import { initiateSketchLibrary } from './engine/sketchLibrary'
import { useAppStore } from './engine/sketchesState'

const listen = (event: string, cb: (info: any) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.InitialSketchLibraryIds, (sketchLibraryIds: string[]) => {
  initiateSketchLibrary(sketchLibraryIds)
})

listen(SketchEvents.ServerStart, (sketchesServerUrl: string) => {
  setSketchesServerUrl(sketchesServerUrl)

  run()
})

listen(SketchEvents.RefreshSketch, (sketchId: string) => {
  refreshSketch(sketchId)
})
