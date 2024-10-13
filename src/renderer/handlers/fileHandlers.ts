import { ProjectData } from 'src/shared/types'
import { useAppStore } from '../appStore'
import { engine, engineStore } from '../engine'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
  saveProjectFileDialog,
  startSketchesServer,
} from '../ipc/mainThreadTalk'

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

export const handleLoadProjectDialog = async () => {
  const response = await openProjectFileDialog()

  if (response.result === 'canceled') return

  if (response.result === 'error') {
    alert(response.error)
    return
  }

  const { sketchesDirAbsolute, projectData, savePath } = response

  await startEngineWithSketchesDir(sketchesDirAbsolute)

  engineStore.getState().loadProject(projectData.engine)
  useAppStore.getState().setCurrentSavePath(savePath)
  useAppStore.getState().setSketchesDir(sketchesDirAbsolute)
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
      date: 'some date here',
      path: response.savePath,
      numSketches: 99,
    })
  }
}
