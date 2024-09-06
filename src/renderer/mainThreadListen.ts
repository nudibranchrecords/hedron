import { SketchEvents } from '../shared/Events'
import { run } from './engine/3d'
import { setSketchesServerUrl } from './engine/3d/globals'
import { initiateSketchModules, reimportSketchModule } from './engine/3d/sketchModules'

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
