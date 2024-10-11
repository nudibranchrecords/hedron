// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { addScene } from './scenes'
import { EngineScene } from './EngineScene'
import { Renderer } from './Renderer'
import { uid } from 'uid'
import { createUniqueId } from '../utils/createUniqueId'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
}

export const createDebugScene = (renderer: Renderer): EngineScene => {
  const id = createUniqueId()
  const scene = addScene(id)
  scene.setRatio(renderer.aspectRatio)
  scene.renderer = renderer.composer?.getRenderer()

  debugScene = scene

  return debugScene
}
