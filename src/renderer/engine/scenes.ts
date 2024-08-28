import { EngineScene } from './EngineScene'

export const engineScenes = new Map<string, EngineScene>()

export const addScene = (sceneId: string): EngineScene => {
  const newScene = new EngineScene()
  engineScenes.set(sceneId, newScene)

  // renderer.setSize()
  // if (shouldSetPost) renderer.setPostProcessing()

  return newScene
}
