// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { createUniqueId } from '@engine/utils/createUniqueId'
import { addScene } from '@engine/world/scenes'
import { EngineScene } from '@engine/world/EngineScene'
import { Renderer } from '@engine/world/Renderer'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
}

export const createDebugScene = (renderer: Renderer): EngineScene => {
  const id = createUniqueId()
  const scene = addScene(id)
  scene.setRatio(renderer.aspectRatio)

  if (!renderer.composer) {
    throw new Error("couldn't get renderer composer")
  }

  scene.renderer = renderer.composer.getRenderer()

  debugScene = scene

  return debugScene
}
