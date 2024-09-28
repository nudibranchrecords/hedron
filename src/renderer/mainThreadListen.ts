import { SketchEvents } from '../shared/Events'
import { engine } from './engine'

const listen = (event: string, cb: (info: any) => void): void => {
  window.electron.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.ReimportSketchModule, (moduleId: string) => {
  engine.reimportSketchModuleAndReloadSketches(moduleId)
})

listen(SketchEvents.AddSketchModule, (moduleId: string) => {
  engine.addSketchModule(moduleId)
})

listen(SketchEvents.RemoveSketchModule, (moduleId: string) => {
  engine.removeSketchModule(moduleId)
})
