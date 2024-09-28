import { useAppStore } from '../appStore'
import { engine, engineStore } from '../engine'
import {
  openProjectFileDialog,
  openSketchesDirDialog,
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

export const handleProjectDialog = async () => {
  const { sketchesDirPath, projectData } = await openProjectFileDialog()

  await startEngineWithSketchesDir(sketchesDirPath)

  engineStore.getState().loadProject(projectData)
}
