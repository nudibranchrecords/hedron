import { RendererType } from '@HedronEngine/types'
import { EngineScene } from '@world/EngineScene'

export const engineScenes = new Map<string, EngineScene>()

export const addScene = (sceneId: string, rendererType: RendererType): EngineScene => {
  const newScene = new EngineScene({ rendererType })
  engineScenes.set(sceneId, newScene)

  return newScene
}
