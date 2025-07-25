// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { createUniqueId } from '@utils/createUniqueId'
import { addScene } from '@world/scenes'
import { EngineScene } from '@world/EngineScene'
import { Renderer } from '@world/Renderer'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
}

export const createDebugScene = (renderer: Renderer): EngineScene => {
  const id = createUniqueId()
  const scene = addScene(id, renderer.rendererType)
  scene.setRatio(renderer.aspectRatio)

  debugScene = scene

  return scene
}
