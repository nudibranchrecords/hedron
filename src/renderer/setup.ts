import { useAppStore } from './appStore'
import { engine } from './engine'
import { startSketchesServer } from './ipc/mainThreadTalk'

export const startEngineWithSketchesDir = async (sketchesDirPath: string) => {
  useAppStore.getState().setSketchesDir(sketchesDirPath)
  const { moduleIds, url } = await startSketchesServer(sketchesDirPath)

  engine.setSketchesUrl(url)
  await engine.initiateSketchModules(moduleIds)

  engine.run()
}
