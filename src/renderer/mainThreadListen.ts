import { SketchEvents } from '../shared/Events'
import { engine } from './engine'

const listen = (event: string, cb: (info: any) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.InitialSketchModuleIds, (sketchModuleIds: string[]) => {
  engine.initiateSketchModules(sketchModuleIds)
})

listen(SketchEvents.ServerStart, (sketchesServerUrl: string) => {
  engine.setSketchesUrl(sketchesServerUrl)

  engine.run()
})

listen(SketchEvents.ReimportSketchModule, (moduleId: string) => {
  engine.reimportSketchModule(moduleId)
})
