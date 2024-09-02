import { SketchEvents } from '../shared/Events'
import { run } from './engine'
import { setSketchesServerUrl } from './engine/globals'
import { initiateSketchModules, reimportSketchModule } from './engine/sketchModules'

const listen = (event: string, cb: (info: any) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.InitialSketchModuleIds, (sketchModuleIds: string[]) => {
  initiateSketchModules(sketchModuleIds)
})

listen(SketchEvents.ServerStart, (sketchesServerUrl: string) => {
  setSketchesServerUrl(sketchesServerUrl)

  run()
})

listen(SketchEvents.ReimportSketchModule, (moduleId: string) => {
  reimportSketchModule(moduleId)
})
