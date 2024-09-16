import { FileEvents, SketchEvents } from '../shared/Events'
import { useAppStore } from './appStore'
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
  console.log(sketchesServerUrl)
  engine.setSketchesUrl(sketchesServerUrl)

  engine.run()
})

listen(SketchEvents.ReimportSketchModule, (moduleId: string) => {
  engine.reimportSketchModuleAndReloadSketches(moduleId)
})

listen(SketchEvents.AddSketchModule, (moduleId: string) => {
  engine.addSketchModule(moduleId)
})

listen(FileEvents.SelectSketchesDir, (sketchesDir: string) => {
  useAppStore.getState().setSketchesDir(sketchesDir)
})
