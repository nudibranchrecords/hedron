import { engine } from '@renderer/engine'
import { handleLoadProjectDialog, handleSaveProjectDialog } from '@renderer/handlers/fileHandlers'
import { AppMenuEvents, AppMenuEventsItem, SketchEvents } from '@shared/Events'
import { appStore, BuildResult } from '@renderer/appStore'

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

listen(SketchEvents.BuildResult, (result: BuildResult) => {
  const state = appStore.getState()

  if (result.errors.length > 0) {
    state.setBuildResult(result)
    state.setGlobalDialogId('sketchBuildResult')
  } else {
    // Clear build result on successful build with no errors
    state.setBuildResult(null)
    if (state.globalDialogId === 'sketchBuildResult') {
      state.setGlobalDialogId(null)
    }
  }
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
