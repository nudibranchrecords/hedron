import { engine } from '@renderer/engine'
import { handleLoadProjectDialog, handleSaveProjectDialog } from '@renderer/handlers/fileHandlers'
import { AppMenuEvents, AppMenuEventsItem, ResourceEvents, SketchEvents } from '@shared/Events'
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
    state.setSketchesServerBuildResult(result)
    state.setGlobalDialogId('sketchesServerBuildResult')
  } else {
    // Clear build result on successful build with no errors
    state.setSketchesServerBuildResult(null)
    if (state.globalDialogId === 'sketchesServerBuildResult') {
      state.setGlobalDialogId(null)
    }
  }
})

listen(ResourceEvents.AddResourceFile, (fileName: string) => {
  appStore.getState().addResourceFile(fileName)
})

listen(ResourceEvents.RemoveResourceFile, (fileName: string) => {
  appStore.getState().removeResourceFile(fileName)
})

listen(ResourceEvents.ChangeResourceFile, (_fileName: string) => {
  // File content changed — no list update needed, consumers re-fetch from URL
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
