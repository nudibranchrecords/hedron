import { SketchEvents } from '../shared/Events'
import { run } from './engine'
import { setSketchesServerUrl } from './engine/globals'
import { initiateSketchLibrary, reimportSketchModule } from './engine/sketchLibrary'

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

listen(SketchEvents.ReimportSketchModule, (sketchId: string) => {
  reimportSketchModule(sketchId)
})
