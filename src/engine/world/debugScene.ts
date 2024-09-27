// import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three'
import { addScene } from './scenes'
import { EngineScene } from './EngineScene'
import { uid } from 'uid'

let debugScene: EngineScene | undefined

export const getDebugScene = (): EngineScene => {
  if (!debugScene) throw new Error('No sketches server url')

  return debugScene
}

export const createDebugScene = (aspectRatio: number): EngineScene => {
  const id = uid()
  const scene = addScene(id)
  scene.setRatio(aspectRatio)

  debugScene = scene

  return debugScene
}
