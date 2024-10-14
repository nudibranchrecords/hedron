import path from 'path-browserify'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
  saveProjectFileDialog,
  startSketchesServer,
} from '@renderer/ipc/mainThreadTalk'
import { engine, engineStore } from '@renderer/engine'
import { useAppStore } from '@renderer/appStore'
import { ProjectData } from '@shared/types'

const startEngineWithSketchesDir = async (sketchesDirPath: string) => {
  const { moduleIds, url } = await startSketchesServer(sketchesDirPath)

  engine.setSketchesUrl(url)
  await engine.initiateSketchModules(moduleIds)

  engine.run()
}

export const handleSketchesDialog = async () => {
  const sketchesDir = await openSketchesDirDialog()

  if (!sketchesDir) return

  useAppStore.getState().setSketchesDir(sketchesDir)
  await startEngineWithSketchesDir(sketchesDir)
}

export const handleLoadProjectDialog = async (projectPath?: string) => {
  const appState = useAppStore.getState()

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
  appState.setCurrentSavePath(savePath)
  appState.setSketchesDir(sketchesDirAbsolute)
}

export const handleSaveProjectDialog = async (options?: { saveAs?: boolean }) => {
  const appState = useAppStore.getState()
  const sketchesDir = appState.sketchesDir

  if (!sketchesDir) {
    throw new Error("Can't save project without sketches dir")
  }

  const engineData = engine.getSaveData()
  const projectData: ProjectData = {
    version: 0,
    engine: engineData,
    app: {
      sketchesDir,
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
      title: path.basename(response.savePath),
      date: Date.now(),
      path: response.savePath,
      numScenes: 1,
      numSketches: Object.keys(projectData.engine.sketches).length,
    })
  }
}
