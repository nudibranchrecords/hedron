import { engine } from '@renderer/engine'
import { handleLoadProjectDialog, handleSaveProjectDialog } from '@renderer/handlers/fileHandlers'
import { AppMenuEvents, AppMenuEventsItem, SketchEvents } from '@shared/Events'
import { appStore, BuildError } from '@renderer/appStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listen = (event: string, cb: (info: any) => void): void => {
  window.electronApi.ipcRenderer.on(event, (_, info) => {
    cb(info)
  })
}

listen(SketchEvents.ReimportSketchModule, (moduleId: string) => {
  engine.reimportSketchModuleAndReloadSketches(moduleId)
})

listen(SketchEvents.AddSketchModule, (moduleId: string) => {
  engine.importSketchModule(moduleId)
})

listen(SketchEvents.RemoveSketchModule, (moduleId: string) => {
  engine.removeSketchModule(moduleId)
})

listen(SketchEvents.BuildErrors, (errors: BuildError[]) => {
  appStore.getState().setBuildErrors(errors)
  appStore.getState().setGlobalDialogId('sketchBuildErrors')
})

listen(SketchEvents.BuildWarnings, (warnings) => {
  console.warn('[Hedron] Build warnings:', warnings)
})

listen(SketchEvents.BuildSuccess, () => {
  // Clear any existing build errors on successful build
  appStore.getState().setBuildErrors([])
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
