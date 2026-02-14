// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { createUniqueId } from '@utils/createUniqueId'
import { engineScenes } from '@world/scenes'
import { EngineScene } from '@world/EngineScene'
import { Renderer } from '@world/Renderer'
import { SketchInstanceError } from '@world/SketchManager'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('debugScene not ready')

  return debugScene
}

export const createDebugScene = (
  renderer: Renderer,
  onSketchInstanceError: SketchInstanceError,
): EngineScene => {
  const sceneId = createUniqueId()

  const newScene = new EngineScene({
    rendererType: renderer.rendererType,
    renderer: renderer.renderer,
    onSketchInstanceError,
  })

  debugScene = newScene
  engineScenes.set(sceneId, newScene)

  return newScene
}
