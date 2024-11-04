import { engine } from '@renderer/engine'
import { handleLoadProjectDialog, handleSaveProjectDialog } from '@renderer/handlers/fileHandlers'
import { AppMenuEvents, AppMenuEventsItem, SketchEvents } from '@shared/Events'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

listen(AppMenuEvents.AppMenuClick, (item: AppMenuEventsItem) => {
  switch (item) {
    case AppMenuEventsItem.Save:
      handleSaveProjectDialog()
      break
    case AppMenuEventsItem.SaveAs:
      handleSaveProjectDialog({ saveAs: true })
      break
    case AppMenuEventsItem.Load:
      handleLoadProjectDialog()
      break
  }
})
