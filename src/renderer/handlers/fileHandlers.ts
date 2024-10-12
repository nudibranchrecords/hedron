import { useAppStore } from '../appStore'
import { engine, engineStore } from '../engine'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
  saveProjectFileDialog,
  startSketchesServer,
} from '../ipc/mainThreadTalk'

const startEngineWithSketchesDir = async (sketchesDirPath: string) => {
  useAppStore.getState().setSketchesDir(sketchesDirPath)
  const { moduleIds, url } = await startSketchesServer(sketchesDirPath)

  engine.setSketchesUrl(url)
  await engine.initiateSketchModules(moduleIds)

  engine.run()
}

export const handleSketchesDialog = async () => {
  const sketchesDirPath = await openSketchesDirDialog()

  if (!sketchesDirPath) return

  await startEngineWithSketchesDir(sketchesDirPath)
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
}

export const handleSaveProjectDialog = async (options?: { saveAs?: boolean }) => {
  const data = engine.getSaveData()

  const savePath = options?.saveAs ? null : useAppStore.getState().currentSavePath

  const response = await saveProjectFileDialog(data, { savePath })

  if (response.result === 'error') {
    alert(response.error)
    return
  }

  if (response.result === 'success') {
    useAppStore.getState().setCurrentSavePath(response.savePath)
  }
}
