import { ProjectData, AppState } from '@hedron-gl/app-store'
import { appStore } from '@renderer/appStore'
import { engine, engineStore } from '@renderer/engine'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
  saveProjectFileDialog,
  startResourcesServer,
  startSketchesServer,
} from '@renderer/ipc/mainThreadTalk'

const startEngineWithSketchesDir = async (
  sketchesDirPath: string,
  resourcesDirAbsolute: string,
) => {
  const { moduleIds, url } = await startSketchesServer(sketchesDirPath)

  const { url: resourcesUrl, files: resources } = await startResourcesServer(resourcesDirAbsolute)

  await engine.importSketchModulesFromIds(url, moduleIds)
  engine.startStoreListener()

  Object.values(resources).forEach(({ fileName, contentType }) => {
    engine.addResource(fileName, contentType)
  })

  engine.run()

  return { resourcesUrl }
}

export const handleSketchesDialog = async () => {
  const response = await openSketchesDirDialog()

  if (response.result !== 'success') return

  const { sketchesDirAbsolute, resourcesDirAbsolute } = response

  const { resourcesUrl } = await startEngineWithSketchesDir(
    sketchesDirAbsolute,
    resourcesDirAbsolute,
  )

  appStore.setState((state: AppState) => ({
    ...state,
    sketchesDir: sketchesDirAbsolute,
    resourcesUrl,
  }))

  engine.ensureGlobalOptionNodes()
  engine.initiatePlugins()
}

export const handleLoadProjectDialog = async (projectPath?: string) => {
  const appState = appStore.getState()
  const response = await openProjectFileDialog(projectPath)

  if (response.result === 'canceled') return

  if (response.result === 'error') {
    alert(response.error)
    if (projectPath) appState.removeFromSaveList(projectPath)
    return
  }

  const { sketchesDirAbsolute, projectData, savePath, resourcesDirAbsolute } = response

  const { resourcesUrl } = await startEngineWithSketchesDir(
    sketchesDirAbsolute,
    resourcesDirAbsolute,
  )

  engineStore.getState().loadProject(projectData.engine)

  engine.ensureGlobalOptionNodes()

  appStore.setState((state: AppState) => ({
    ...state,
    currentSavePath: savePath,
    resourcesUrl,
    ...projectData.app,
  }))

  // Add/remove shots from sketches based on their current module configs, in case files were updated since last load
  engine.reconcileAllSketchNodes()

  engine.initiatePlugins()

  appStore.getState().cleanupStaleReferences(engine.getSaveData())
}

export const handleSaveProjectDialog = async (options?: { saveAs?: boolean }) => {
  const appState = appStore.getState()
  const { sketchesDir, openedControlGroups, selectedNodes, selectedInputs, activeSketchId } =
    appState

  if (!sketchesDir) {
    throw new Error("Can't save project without sketches dir")
  }

  const engineData = engine.getSaveData()
  const projectData: ProjectData = {
    version: 0,
    engine: engineData,
    app: {
      sketchesDir,
      activeSketchId,
      selectedNodes,
      selectedInputs,
      openedControlGroups,
    },
  }

  const savePath = options?.saveAs ? null : appState.currentSavePath

  const response = await saveProjectFileDialog(projectData, { savePath })

  if (response.result === 'error') {
    alert(response.error)
    return
  }

  if (response.result === 'success') {
    appState.setCurrentSavePath(response.savePath)
    appState.addToSaveList({
      title: response.fileNameWithoutExt,
      date: Date.now(),
      path: response.savePath,
      numScenes: 1,
      numSketches: Object.keys(projectData.engine.sketches).length,
    })
  }
}
