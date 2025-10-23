import { ProjectData } from '@hedron/app-store'
import { appStore } from '@renderer/appStore'
import { engine, engineStore } from '@renderer/engine'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
  saveProjectFileDialog,
  startSketchesServer,
} from '@renderer/ipc/mainThreadTalk'

const startEngineWithSketchesDir = async (sketchesDirPath: string) => {
  const { moduleIds, url } = await startSketchesServer(sketchesDirPath)

  await engine.initiateSketchModules(url, moduleIds)

  engine.run()
}

export const handleSketchesDialog = async () => {
  const sketchesDir = await openSketchesDirDialog()

  if (!sketchesDir) return

  appStore.getState().setSketchesDir(sketchesDir)
  await startEngineWithSketchesDir(sketchesDir)
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

  const { sketchesDirAbsolute, projectData, savePath } = response

  await startEngineWithSketchesDir(sketchesDirAbsolute)

  engineStore.getState().loadProject(projectData.engine)

  appStore.setState((state) => ({
    ...state,
    currentSavePath: savePath,
    ...projectData.app,
  }))
}

export const handleSaveProjectDialog = async (options?: { saveAs?: boolean }) => {
  const appState = appStore.getState()
  const { sketchesDir, openedParamGroups, selectedNodes, selectedInputs } = appState

  if (!sketchesDir) {
    throw new Error("Can't save project without sketches dir")
  }

  const engineData = engine.getSaveData()
  const projectData: ProjectData = {
    version: 0,
    engine: engineData,
    app: {
      sketchesDir,
      selectedNodes,
      selectedInputs,
      openedParamGroups,
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
